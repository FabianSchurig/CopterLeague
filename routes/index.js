module.exports = function(app) {
    require('./facebook')(app);

    app.use(function (req, res, next) {
        res.status(404).render('404');
    });
};
