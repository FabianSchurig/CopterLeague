const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const bcrypt = require('bcryptjs');
const bluebird = require('bluebird');
const compareAsync = bluebird.promisify(bcrypt.compare);
const token = require('./token');
const config = require('../../config');
const request = require('request');
const getAsync = bluebird.promisify(request.get);

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, function(email, password, done) {
    Pilot.findOne({
        where: {email}
    }).then(function(pilot) {
        if(! pilot) {
            return done(null, false);
        }

        // check password
        return compareAsync(password, pilot.password).then(function(same) {
            if(same) {
                done(null, pilot);
            } else {
                done(null, false);
            }
        });
    }).catch(function(err) {
        done(err);
    });
}));

module.exports = function(app) {
    /**
     * @api {post} /auth/login Login via email and password
     * @apiName LoginPassword
     * @apiGroup Auth
     *
     * @apiParam {String} email User email
     * @apiParam {String} password User password
     *
     * @apiError {String} status  "fail" / "error"
     * @apiError {Object} message Error Message
     *
     * @apiSuccess {String}   status     "success"
     * @apiSuccess {Object} data       Authorization data
     * @apiSuccess {Number}   data.id    Pilot ID
     * @apiSuccess {String}   data.token Authorization Token
     */
    app.post('/auth/login', passport.authenticate('local', {session: false}), function(req, res) {
        token.login(req.user.id, res)
        .catch(function(err) {
            return res.status(500).json({
                status: 'error',
                message: 'JWT'
            });
        });
    });

    app.post('/auth/facebook', function(req, res) {
        getAsync({
            url: 'https://graph.facebook.com/v2.6/debug_token',
            qs: {
                input_token:  req.body.accessToken,
                access_token:  config.facebook.clientID + '|' + config.facebook.clientSecret
            }
        }).then(function(httpResponse) {
            const result = JSON.parse(httpResponse.body).data;
            const result_is_valid = result && result.is_valid &&
                result.app_id == config.facebook.clientID && result.user_id;

            if(! result_is_valid) {
                return bluebird.reject('INVALID_ACCESS_TOKEN');
            }

            return getAsync({
                url: 'https://graph.facebook.com/v2.6/me',
                qs: {
                    fields: 'id,name,first_name,last_name',
                    access_token: req.body.accessToken
                }
            });
        }).then(function(httpResponse) {
            const profile = JSON.parse(httpResponse.body);

            return Pilot.findOrCreate({
                where: {
                    facebookId: profile.id
                },
                defaults: {
                    alias: profile.name,
                    firstName: profile.first_name,
                    familyName: profile.last_name
                }
            });
        }).spread(function(pilot, created) {
            return token.login(pilot.id, res);
        }).catch(function(err) {
            return res.status(500).json({
                status: 'error',
                message: error
            });
        });
    });
};
