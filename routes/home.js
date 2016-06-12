module.exports = function(app) {
    app.get('/', function(req, res) { res.render('layout'); });
    app.get('/pilots', function(req, res) { res.render('layout'); });
    app.get('/events', function(req, res) { res.render('layout'); });
    app.get('/event/detail/:id', function(req, res) { res.render('layout'); });
    app.get('/pilot/detail/:id', function(req, res) { res.render('layout'); });

	app.get('/app.component.pug', function(req, res) {
	res.render('app.component.pug');
	});
	app.get('/pilots.component.pug', function(req, res) {
	res.render('pilots.component.pug');
	});
	app.get('/events.component.pug', function(req, res) {
	res.render('events.component.pug');
	});
	app.get('/event-detail.component.pug', function(req, res) {
	res.render('event-detail.component.pug');
	});
	app.get('/pilot-detail.component.pug', function(req, res) {
	res.render('pilot-detail.component.pug');
	});
	app.get('/login.component.pug', function(req, res) {
	res.render('login.component.pug');
	});
	app.get('/register.component.pug', function(req, res) {
	res.render('register.component.pug');
	});
};
