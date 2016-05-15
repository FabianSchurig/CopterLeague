module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('layout', { title: 'Hey', message: 'Hello there!'});
    });
	app.get('/app.component.pug', function(req, res) {
	res.render('app.component.pug', { title: 'Hey', message: 'Hello there!'});
	});
};
