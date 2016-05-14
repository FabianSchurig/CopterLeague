module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('layout.pug', { title: 'Hey', message: 'Hello there!'});
    });
};
