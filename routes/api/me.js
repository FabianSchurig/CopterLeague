module.exports = function(app) {
    app.get('/me', function(req, res) {
        res.json({a: 5});
    });
};
