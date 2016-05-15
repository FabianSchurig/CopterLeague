const instance = require('../../models').instance;
const Event = instance.model('Event');

module.exports = function(app) {
    app.get('/event', function(req, res) {
        Event.scope('public').findAll().then(function(events) {
            res.json(events);
        }).catch(function(err) {
            console.log(err);
            res.status(500).end();
        });
    });

    app.post('/event', function(req, res) {
        Event.create({
            title: req.body.title,
            deadline: req.body.deadline,
            date: req.body.date,
            maxParticipants: req.body.maxParticipants,
            location: req.body.location,
            notes: req.body.notes
        }).then(function(event) {
            res.json(event);
        }).catch(function(err) {
            console.log(err);
            res.status(500).end();
        });
    });
};
