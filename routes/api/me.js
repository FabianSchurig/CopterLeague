module.exports = function(app) {
    app.get('/me', function(req, res) {
        res.redirect('/api/pilot/' + req.user.id);
    });
};
