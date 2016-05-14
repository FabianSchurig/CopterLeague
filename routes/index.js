const config = require('../config');

module.exports = function(app) {
    require('./api')(app);
    require('./home')(app);

    if(config.facebook) {
        require('./facebook')(app);
    }

    app.use(function (req, res, next) {
        res.status(404).render('404');
    });
};
