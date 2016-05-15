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
};
