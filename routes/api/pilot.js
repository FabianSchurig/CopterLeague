const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const auth = require('./auth');

module.exports = function(app) {
    app.get('/pilot', function(req, res) {
        Pilot.scope('public').findAll().then(function(pilots) {
            res.json(pilots);
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.get('/pilot/:id', function(req, res) {
        Pilot.scope('public').findById(req.params.id).then(function(pilot) {
            if(pilot) {
                res.json(pilot);
            } else {
                res.status(404).end();
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.put('/pilot/:id', auth(function(req) {
        return req.user.admin || '' + req.user.id === req.params.id;
    }), function(req, res) {
        Pilot.update(req.body, {
            fields: ['alias', 'familyName', 'firstName', 'notes'],
            where: {
                id: req.params.id
            }
        }).then(function() {
            return Pilot.scope('public').findById(req.params.id);
        }).then(function(pilot) {
            if(pilot) {
                res.json(pilot);
            } else {
                res.status(404).end();
            }
        }).catch(function(err) {
            console.log(err);
            res.status(500).end();
        });
    });
};
