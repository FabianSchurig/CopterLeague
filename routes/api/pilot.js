const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const Image = instance.model('Image');
const Multi = instance.model('Multi');
const bcrypt = require('bcryptjs');
const bluebird = require('bluebird');
const hashAsync = bluebird.promisify(bcrypt.hash);
const token = require('./token');
const passport = require('passport');
const common = require('./common');

const BCRYPT_ROUNDS = 10;

module.exports = function(app) {
    /**
     * @api {get} /pilot Get Pilot List
     * @apiName GetPilot
     * @apiGroup Pilot
     *
     * @apiError {String} status  "fail" / "error"
     * @apiError {Object} message Error Message
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Object[]} data Pilots
     * @apiSuccess {Number} data.id Pilot ID
     * @apiSuccess {String} data.alias Pilot alias
     * @apiSuccess {String} data.firstName Pilot first name
     * @apiSuccess {String} data.familyName Pilot family name
     * @apiSuccess {Object} data.avatar Pilot avatar image
     * @apiSuccess {String} data.avatar.small Small avatar image URL (80x80)
     * @apiSuccess {String} data.avatar.medium Medium avatar image URL (400x400)
     */
    app.get('/pilot', function(req, res) {
        Pilot.findAll({
            attributes: ['id', 'alias', 'firstName', 'familyName']
        }).then(function(pilots) {
            return bluebird.all(pilots.map(pilot => pilot.getImages({
                order: [['createdAt', 'DESC']],
                limit: 1
            }))).then(function(images) {
                res.json({
                    status: 'success',
                    data: pilots.map((pilot, index) => {
                        pilot = pilot.toJSON();
                        if(images[index].length > 0) {
                            pilot.avatar = common.imageObject(images[index][0]);
                        }
                        return pilot;
                    })
                });
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });

    /**
     * @api {post} /pilot Create New Pilot
     * @apiName PostPilot
     * @apiGroup Pilot
     *
     * @apiParam {String} alias Pilot nick name
     * @apiParam {String} email Pilot email address
     * @apiParam {String} password Password
     * @apiParam {String} firstName Optional. Pilot first name
     * @apiParam {String} familyName Optional. Pilot family name
     *
     * @apiError {String} status  "fail" / "error"
     * @apiError {Object} message Error Message
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Object} data Pilot data
     * @apiSuccess {Number} data.id Pilot ID
     */
    app.post('/pilot', function(req, res) {
        req.checkBody('alias', 'alias has maximum length of 40').isLength({min: 1, max: 40});
        req.checkBody('email', 'email must be valid').isEmail();
        req.checkBody('password', 'password must be at least 6 characters long').isLength({min: 6});
        req.checkBody('firstName').optional().isLength({min: 1});
        req.checkBody('familyName').optional().isLength({min: 1});

        const errors = req.validationErrors();
        if(errors) {
            return res.status(400).json({
                status: 'fail',
                message: errors
            });
        }

        hashAsync(req.body.password, BCRYPT_ROUNDS).then(function(encryptedPass) {
            return Pilot.create({
                alias: req.body.alias,
                email: req.body.email,
                password: encryptedPass,
                firstName: req.body.firstName,
                familyName: req.body.familyName
            });
        }).then(function(pilot) {
            return token.login(pilot.id, res);
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });

    /**
     * @api {get} /pilot/:id Get Pilot Details
     * @apiName GetPilotId
     * @apiGroup Pilot
     *
     * @apiParam {Number} id Unique Pilot ID
     *
     * @apiError {String} status  "fail" / "error"
     * @apiError {Object} message Error Message
     *
     * @apiSuccess {String} status  "success"
     * @apiSuccess {Object} data    Pilot
     * @apiSuccess {Number} data.id Pilot ID
     * @apiSuccess {String} data.alias
     * @apiSuccess {String} data.firstName
     * @apiSuccess {String} data.familyName
     * @apiSuccess {String} data.notes
     * @apiSuccess {String} data.telephone
     * @apiSuccess {String} data.location
     * @apiSuccess {Number} data.lat
     * @apiSuccess {Number} data.lng
     * @apiSuccess {Object} data.avatar Avatar Image
     * @apiSuccess {String} data.avatar.small Small Image URL (80x80)
     * @apiSuccess {String} data.avatar.medium Medium Image URL (400x400)
     */
    app.get('/pilot/:id', function(req, res) {
        Pilot.findById(req.params.id, {
            attributes: ['id', 'alias', 'firstName', 'familyName', 'notes',
                'telephone', 'location', 'lat', 'lng'],
            include: [
                {
                    model: Image,
                    required: false,
                }
            ],
            limit: 1,
            order: [[Image, 'createdAt', 'DESC']]
        }).then(function(pilot) {
            if(! pilot) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Not Found'
                });
            }

            pilot = pilot.toJSON();
            if(pilot.Images.length > 0) {
                pilot.avatar = common.imageObject(pilot.Images[0]);
            }
            pilot.Images = undefined;

            res.json({
                status: 'success',
                data: pilot
            });
        }).catch(function(err) {
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });

    /**
     * @api {put} /pilot/:id Change Pilot
     * @apiName PutPilotId
     * @apiGroup Pilot
     *
     * @apiParam {String}          alias Pilot nick name
     * @apiParam {String}          firstName
     * @apiParam {String}          familyName
     * @apiParam {String}          telephone
     * @apiParam {String}          notes
     * @apiParam {String}          location
     * @apiParam {Number}          lat
     * @apiParam {Number}          lng
     *
     * @apiError {String} status  "fail" / "error"
     * @apiError {Object} message Error Message
     *
     * @apiSuccess {String} status  "success"
     * @apiSuccess {Object} data    Pilot
     * @apiSuccess {Number} data.id Pilot ID
     */
    app.put('/pilot/:id', passport.authenticate('bearer', {session: false}), function(req, res) {
        if(! (req.user && ('' + req.user.id) === ('' + req.params.id))) {
            return res.status(403).json({
                status: 'fail',
                message: 'AUTH'
            });
        }

        req.checkBody('alias', 'alias has maximum length of 40').optional().isLength({min: 1, max: 40});
        req.checkBody('firstName').optional().isLength({min: 1});
        req.checkBody('familyName').optional().isLength({min: 1});
        req.checkBody('location').optional().isLength({min: 1});
        req.checkBody('lat').optional().isFloat({min: -90, max: 90});
        req.checkBody('lng').optional().isFloat({min: -180, max: 180});

        req.sanitizeBody('telephone').whitelist('0123456789/+ ');
        req.sanitizeBody('lat').toFloat();
        req.sanitizeBody('lng').toFloat();

        const errors = req.validationErrors();
        if(errors) {
            res.status(400).json({
                status: 'fail',
                message: errors
            });
            return;
        }

        Pilot.update(req.body, {
            fields: ['alias', 'familyName', 'firstName', 'notes', 'telephone',
                'location', 'lat', 'lng'],
            where: {
                id: req.params.id
            }
        }).then(function(affectedCount) {
            if(affectedCount === 0) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'NOT_FOUND'
                });
            }

            res.json({
                status: 'success',
                data: {
                    id: req.params.id
                }
            });
        }).catch(function(err) {
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });

    /**
     * @api {post} /pilot/:id/multi Create Multi for Pilot
     * @apiName PostPilotIdMulti
     * @apiGroup Pilot
     *
     * @apiParam {String}             name Copter name
     * @apiParam {Number{1-1000}}     frameSize Size of frame
     * @apiParam {Number{1-300}}      propellerSize Size of propellers
     * @apiParam {Number{2-5}}        propellerBlades Number of blades per propeller
     * @apiParam {Number{3-4}}        battery Battery type, 3S or 4S
     * @apiParam {Number{3-6}}        numberOfMotors Number of active motors
     * @apiParam {String}             notes
     *
     * @apiError {String} status  "fail" / "error"
     * @apiError {Object} message Error Message
     *
     * @apiSuccess {String} status  "success"
     * @apiSuccess {Object} data    Multi
     * @apiSuccess {Number} data.id Multi ID
     */
    app.post('/pilot/:id/multi', passport.authenticate('bearer', {session: false}), function(req, res) {
        if(! (req.user && ('' + req.user.id) === req.params.id)) {
            return res.status(403).json({
                status: 'fail',
                message: 'AUTH'
            });
        }

        req.checkBody('name').isLength({max: 200});
        req.checkBody('frameSize').isInt({min: 1, max: 1000});
        req.checkBody('propellerSize').isInt({min: 1, max: 300});
        req.checkBody('propellerBlades').isInt({min: 2, max: 5});
        req.checkBody('battery').isInt({min: 3, max: 4});
        req.checkBody('numberOfMotors').isInt({min: 3, max: 6});
        req.checkBody('notes').optional().isLength({max: 1000});

        Multi.create({
            PilotId: req.user.id,
            name: req.body.name,
            frameSize: req.body.frameSize,
            propellerSize: req.body.propellerSize,
            propellerBlades: req.body.propellerBlades,
            battery: req.body.battery,
            numberOfMotors: req.body.numberOfMotors,
            notes: req.body.notes
        }).then(function(multi) {
            res.json({
                status: 'success',
                data: {
                    id: multi.id
                }
            });
        }).catch(function(err) {
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });

    app.get('/pilot/:id/multi', function(req, res) {
        Multi.findAll({
            attributes: ['id', 'name', 'frameSize', 'propellerSize',
                'propellerBlades', 'battery', 'numberOfMotors', 'notes'],
            where: {
                PilotId: req.params.id
            }
        }).then(function(multis) {
            res.json({
                status: 'success',
                data: multis
            });
        }).catch(function(err) {
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });
};
