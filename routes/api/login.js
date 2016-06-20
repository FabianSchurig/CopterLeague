const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const bcrypt = require('bcryptjs');
const bluebird = require('bluebird');
const compareAsync = bluebird.promisify(bcrypt.compare);
const token = require('./token');
const config = require('../../config');

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
};
