const validator = require('validator');
const bluebird = require('bluebird');
const auth = require('./auth');
const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const Event = instance.model('Event');
const Participation = instance.model('Participation');

module.exports = function(app) {
    /**
     * @api {get} /event Get Event list
     * @apiGroup Event
     *
     * @apiSuccess {Number} id Event ID
     * @apiSuccess {Date} date Event Day, formatted as ISO 8601
     * @apiSuccess {Date} deadline Deadline for registration, formatted as ISO 8601
     * @apiSuccess {String} title Event title
     * @apiSuccess {Boolean} isCancelled If Event was cancelled
     * @apiSuccess {String} location Event location
     * @apiSuccess {Object[]} participants Three participants
     * @apiSuccess {Number} participants.id Pilot ID
     * @apiSuccess {String} participants.alias Pilot alias
     */
    app.get('/event', function(req, res) {
        Event.findAll({
            attributes: ['id', 'date', 'deadline', 'title', 'isCancelled',
                'location'],
            limit: 10
        }).then(function(events) {
            // For every event get 3 participants
            var eventPilots = [];
            events.forEach(function(event) {
                eventPilots.push(event.getPilots({
                    attributes: ['id', 'alias'],
                    limit: 3
                }));
            });
            bluebird.all(eventPilots).then(function(pilots) {
                for(var i = 0; i < events.length; i++) {
                    pilots[i] = pilots[i].map(function(pilot) {
                        pilot = pilot.toJSON();
                        pilot.Participation = undefined;
                        return pilot;
                    });
                    events[i] = events[i].toJSON();
                    events[i].participants = pilots[i];
                }
                res.json(events);
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).end();
        });
    });

    app.post('/event', auth(function() {
        return true;
    }), function(req, res) {
        Event.create({
            title: req.body.title,
            deadline: req.body.deadline,
            date: req.body.date,
            maxParticipants: req.body.maxParticipants,
            location: req.body.location,
            notes: req.body.notes
        }).then(function(event) {
            return Participation.create({
                PilotId: req.user.id,
                EventId: event.id,
                isCreator: true
            });
        }).then(function() {
            res.status(200).end();
        }).catch(function(err) {
            console.log(err);
            res.status(500).end();
        });
    });

    /**
     * @api {get} /event/:id Get Event details
     * @apiGroup Event
     *
     * @apiParam {Number} id Unique Event ID
     *
     * @apiSuccess {Number} id Event ID
     * @apiSuccess {Date} date Event Day, formatted as ISO 8601
     * @apiSuccess {Date} deadline Deadline for registration, formatted as ISO 8601
     * @apiSuccess {String} title Event title
     * @apiSuccess {Boolean} isCancelled If Event was cancelled by creator
     * @apiSuccess {Number} maxParticipants Maximum number of participants
     * @apiSuccess {String} location Event location
     * @apiSuccess {String} policy Event policy
     * @apiSuccess {String} notes Event detail text
     * @apiSuccess {Object[]} participants All pilots participating
     * @apiSuccess {Number} participants.id Pilot ID
     * @apiSuccess {String} participants.alias Pilot alias
     * @apiSuccess {String} participants.firstName Pilot first name
     * @apiSuccess {String} participants.familyName Pilot last name
     * @apiSuccess {Boolean} participants.isCreator If Pilot is creator of this Event
     */
    app.get('/event/:id', function(req, res) {
        Event.findById(req.params.id, {
            attributes: ['id', 'date', 'deadline', 'title', 'isCancelled',
                'maxParticipants', 'location', 'policy', 'notes'],
            include: [
                {
                    model: Pilot,
                    attributes: ['id', 'alias', 'firstName', 'familyName'],
                    through: {
                        model: Participation,
                        attributes: ['isCreator']
                    }
                }
            ]
        }).then(function(event) {
            event = event.toJSON();
            event.participants = event.Pilots;
            event.Pilots = undefined;
            event.participants.forEach(function(pilot) {
                pilot.isCreator = pilot.Participation.isCreator;
                pilot.Participation = undefined;
            });
            res.json(event);
        }).catch(function(err) {
            console.log(err);
            res.status(500).end();
        });
    });
};
