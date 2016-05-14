const passport = require('passport');
const instance = require('../models').instance;

module.exports = function() {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        instance.model('Pilot').findById(id).then(function(user) {
            done(null, user);
        }).catch(function(err) {
            done(err, false);
        });
    });
};
