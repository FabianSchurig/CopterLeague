const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const Image = instance.model('Image');
const auth = require('./auth');
const bcrypt = require('bcryptjs');
const bluebird = require('bluebird');
const hashAsync = bluebird.promisify(bcrypt.hash);
const token = require('./token');
const passport = require('passport');
const common = require('./common');

const BCRYPT_ROUNDS = 10;

module.exports = function(app) {
    app.get('/pilot', function(req, res) {
        Pilot.scope('public').findAll().then(function(pilots) {
            res.json(pilots);
        }).catch(function(err) {
            console.log(err);
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
            return token.generate(pilot.id, false).then(function(token) {
                res.json({
                    status: 'success',
                    data: {
                        id: pilot.id,
                        token
                    }
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
     * @apiSuccess {String} alias
     * @apiSuccess {String} firstName
     * @apiSuccess {String} familyName
     * @apiSuccess {String} notes
     * @apiSuccess {String} telephone
     * @apiSuccess {Object} avatar Avatar Image
     * @apiSuccess {String} avatar.small Small Image URL (80x80)
     * @apiSuccess {String} avatar.medium Medium Image URL (400x400)
     */
    app.get('/pilot/:id', function(req, res) {
        Pilot.findById(req.params.id, {
            attributes: ['id', 'alias', 'firstName', 'familyName', 'notes', 'telephone'],
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

        req.sanitizeBody('telephone').whitelist('0123456789/+ ');

        const errors = req.validationErrors();
        if(errors) {
            res.status(400).json({
                status: 'fail',
                message: errors
            });
            return;
        }

        Pilot.update(req.body, {
            fields: ['alias', 'familyName', 'firstName', 'notes', 'telephone'],
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
};
