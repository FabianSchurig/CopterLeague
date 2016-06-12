const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const auth = require('./auth');
const bcrypt = require('bcryptjs');
const bluebird = require('bluebird');
const hashAsync = bluebird.promisify(bcrypt.hash);

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
		console.log(req.body);
        hashAsync(req.body.password, BCRYPT_ROUNDS).then(function(encryptedPass) {
            return Pilot.create({
                alias: req.body.alias,
                email: req.body.email,
                password: encryptedPass,
                firstName: req.body.firstName,
                familyName: req.body.familyName
            });
        }).then(function(pilot) {
            res.json({
                status: 'success',
                data: {
                    id: pilot.id
                }
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });

    app.get('/pilot/:id', function(req, res) {
        Pilot.scope('public').findById(req.params.id).then(function(pilot) {
            if(pilot) {
                res.json(pilot);
            } else {
                res.status(404).end();
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.put('/pilot/:id', auth(function(req) {
        return req.user.admin || '' + req.user.id === req.params.id;
    }), function(req, res) {
        Pilot.update(req.body, {
            fields: ['alias', 'familyName', 'firstName', 'notes'],
            where: {
                id: req.params.id
            }
        }).then(function() {
            return Pilot.scope('public').findById(req.params.id);
        }).then(function(pilot) {
            if(pilot) {
                res.json(pilot);
            } else {
                res.status(404).end();
            }
        }).catch(function(err) {
            console.log(err);
            res.status(500).end();
        });
    });
};
