const passport = require('passport');

module.exports = function(app) {
    app.get('/me', passport.authenticate('bearer', { session: false }), function(req, res) {
        res.redirect('/api/pilot/' + req.user.id);
    });
};
