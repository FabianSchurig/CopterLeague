module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('layout', { title: 'Hey', message: 'Hello there!'});
    });
	app.get('/app.component.pug', function(req, res) {
	res.render('app.component.pug', { title: 'Hey', message: 'Hello there!'});
	});
	app.get('/pilots.component.pug', function(req, res) {
	res.render('pilots.component.pug', { title: 'Hey', message: 'Hello there!'});
	});
	app.get('/events.component.pug', function(req, res) {
	res.render('events.component.pug', { title: 'Hey', message: 'Hello there!'});
	});
	app.get('/event-detail.component.pug', function(req, res) {
	res.render('event-detail.component.pug', { title: 'Hey', message: 'Hello there!'});
	});
};
