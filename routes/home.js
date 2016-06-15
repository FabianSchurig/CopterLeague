const config = require('../config');

module.exports = function(app) {
	function layout(req, res) { res.render('layout', { 'googleMapsKey' : config.googleMaps.APIKey}); };
    app.get('/', layout );
    app.get('/pilots', layout );
    app.get('/events', layout );
    app.get('/event/detail/:id', layout );
    app.get('/pilot/detail/:id', layout );

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
