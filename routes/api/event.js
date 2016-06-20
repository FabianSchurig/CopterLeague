const bluebird = require('bluebird');
const passport = require('passport');
const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const Event = instance.model('Event');
const Participation = instance.model('Participation');

module.exports = function(app) {
    /**
     * @api {get} /event Get Event List
     * @apiName GetEvent
     * @apiGroup Event
     *
     * @apiParam {Number{1-20}}          limit=10 Maximum number of results
     * @apiParam {Number{0-}}            offset=0 Offset in results
     * @apiParam {String="title","date"} order="date" Order by column
     * @apiParam {String="asc","desc"}   dir="asc" Order direction
     *
     * @apiError {String} status  "fail" / "error"
     * @apiError {Object} message Error Message
     *
     * @apiSuccess {String}   status                  "success"
     * @apiSuccess {Object[]} data                    Event List
     * @apiSuccess {Number}   data.id                 Event ID
     * @apiSuccess {Date}     data.date               Event Day, formatted as ISO 8601
     * @apiSuccess {Date}     data.deadline           Deadline for registration, formatted as ISO 8601
     * @apiSuccess {String}   data.title              Event title
     * @apiSuccess {Boolean}  data.isCancelled        If Event was cancelled
     * @apiSuccess {String}   data.location           Event location
     * @apiSuccess {Number}   data.lat                Event location latitude
     * @apiSuccess {Number}   data.lng                Event location longitude
     * @apiSuccess {Object[]} data.participants       Three participants
     * @apiSuccess {Number}   data.participants.id    Pilot ID
     * @apiSuccess {String}   data.participants.alias Pilot alias
     */
    app.get('/event', function(req, res) {
        req.checkQuery('limit', 'limit must be >=1 and <=20').optional().isInt({min: 1, max: 20});
        req.checkQuery('offset', 'offset must be >=0').optional().isInt({min: 0});
        req.checkQuery('order', 'order must be "title" or "date"').optional().isIn(['title', 'date']);
        req.checkQuery('dir', 'dir must be "asc" or "desc"').optional().isIn(['asc', 'desc']);

        req.sanitizeQuery('limit').toInt();
        req.sanitizeQuery('offset').toInt();
        req.query.limit = req.query.limit || 10;
        req.query.offset = req.query.offset || 0;
        req.query.order = req.query.order || 'date';
        req.query.dir = req.query.dir || 'asc';

        const errors = req.validationErrors();
        if(errors) {
            res.status(400).json({
                status: 'fail',
                message: errors
            });
            return;
        }

        Event.findAll({
            attributes: ['id', 'date', 'deadline', 'title', 'isCancelled',
                'location', 'lat', 'lng'],
            limit: req.query.limit,
            offset: req.query.offset,
            order: [
                [req.query.order, req.query.dir]
            ]
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
                res.json({
                    status: 'success',
                    data: events
                });
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });

    /**
     * @api {post} /event Create New Event
     * @apiName PostEvent
     * @apiGroup Event
     *
     * @apiPermission user
     *
     * @apiParam {String} title Event title
     * @apiParam {Date}   date Event date, formatted as ISO 8601
     * @apiParam {Date}   deadline="date" Optional. Event deadline, formatted as ISO 8601
     * @apiParam {Number{1-}} maxParticipants Optional. Maximum number of participants
     * @apiParam {String} location Optional. Event location
     * @apiParam {Number} lat Optional. Event latitude location
     * @apiParam {Number} lng Optional. Event longitude location
     * @apiParam {String} notes Optional. Event detail text
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Object} data Event data
     * @apiSuccess {Number} data.id Event ID
     */
    app.post('/event', passport.authenticate('bearer', {session: false}), function(req, res) {
        if(! req.user) {
            return res.status(403).json({
                status: 'fail',
                message: 'AUTH'
            });
        }

        req.checkBody('date', 'date must be valid ISO 8601 date string').isISO8601();
        req.checkBody('deadline', 'deadline must be valid ISO 8601 date string').optional().isISO8601();
        req.checkBody('maxParticipants', 'maxParticipants must be an integer >0').optional().isInt({min: 1});
        req.checkBody('lat').optional().isFloat({min: -90, max: 90});
        req.checkBody('lng').optional().isFloat({min: -180, max: 180});

        req.sanitizeBody('lat').toFloat();
        req.sanitizeBody('lng').toFloat();

        const errors = req.validationErrors();
        if(errors) {
            res.status(400).json({
                status: 'fail',
                message: errors
            });
            return;
        }

        Event.create({
            title: req.body.title,
            date: req.body.date,
            deadline: req.body.deadline || req.body.date,
            maxParticipants: req.body.maxParticipants,
            location: req.body.location,
            notes: req.body.notes,
            lat: req.body.lat,
            lng: req.body.lng
        }).then(function(event) {
            return Participation.create({
                PilotId: req.user.id,
                EventId: event.id,
                isCreator: true
            });
        }).then(function(participation) {
            res.json({
                status: 'success',
                data: {
                    id: participation.EventId
                }
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });

    /**
     * @api {get} /event/:id Get Event Details
     * @apiName GetEventId
     * @apiGroup Event
     *
     * @apiParam {Number} id Unique Event ID
     *
     * @apiSuccess {String}   status "success"
     * @apiSuccess {Object}   data Pilot
     * @apiSuccess {Number}   data.id Event ID
     * @apiSuccess {Date}     data.date Event Day, formatted as ISO 8601
     * @apiSuccess {Date}     data.deadline Deadline for registration, formatted as ISO 8601
     * @apiSuccess {String}   data.title Event title
     * @apiSuccess {Boolean}  data.isCancelled If Event was cancelled by creator
     * @apiSuccess {Number}   data.maxParticipants Maximum number of participants
     * @apiSuccess {String}   data.location Event location
     * @apiSuccess {Number}   data.lat Event location latitude
     * @apiSuccess {Number}   data.lng Event location logitude
     * @apiSuccess {String}   data.policy Event policy
     * @apiSuccess {String}   data.notes Event detail text
     * @apiSuccess {Object[]} data.participants All pilots participating
     * @apiSuccess {Number}   data.participants.id Pilot ID
     * @apiSuccess {String}   data.participants.alias Pilot alias
     * @apiSuccess {String}   data.participants.firstName Pilot first name
     * @apiSuccess {String}   data.participants.familyName Pilot last name
     * @apiSuccess {Boolean}  data.participants.isCreator If Pilot is creator of this Event
     */
    app.get('/event/:id', function(req, res) {
        Event.findById(req.params.id, {
            attributes: ['id', 'date', 'deadline', 'title', 'isCancelled',
                'maxParticipants', 'location', 'lat', 'lng', 'policy', 'notes'],
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
            res.json({
                status: 'success',
                data: event
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });
};
