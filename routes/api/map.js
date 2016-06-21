const bluebird = require('bluebird');
const instance = require('../../models').instance;
const Pilot = instance.model('Pilot');
const Event = instance.model('Event');

module.exports = function(app) {
    /**
     * @api {get} /map Get Map
     * @apiName GetMap
     * @apiGroup Map
     *
     * @apiError {String} status  "fail" / "error"
     * @apiError {Object} message Error Message
     *
     * @apiSuccess {String}   status                  "success"
     * @apiSuccess {Object[]} data                    Marker List
     * @apiSuccess {String}   data.type               Marker type ("pilot" or "event")
     * @apiSuccess {String}   data.name               Marker name (alias for pilots, title for events)
     * @apiSuccess {Number}   data.id                 Marker id
     * @apiSuccess {Number}   data.lat                Marker latitude
     * @apiSuccess {Number}   data.lng                Marker longitude
     * @apiSuccess {String}   data.location           Marker formatted address
     */
    app.get('/map', function(req, res) {
        bluebird.join(
            Pilot.findAll({
                attributes: ['id', 'alias', 'lat', 'lng', 'location'],
                where: {
                    lat: {$ne: null},
                    lng: {$ne: null}
                }
            }),
            Event.findAll({
                attributes: ['id', 'title', 'lat', 'lng', 'location'],
                where: {
                    lat: {$ne: null},
                    lng: {$ne: null}
                }
            }),
            function(pilots, events) {
                res.json({
                    status: 'success',
                    data: pilots.map(row => {
                            row = row.toJSON(); console.log(row);
                            row.type = 'pilot';
                            row.name = row.alias;
                            row.alias = undefined;
                            return row;
                        }).concat(events.map(row => {
                            row = row.toJSON(); console.log(row);
                            row.type = 'event';
                            row.name = row.title;
                            row.title = undefined;
                            return row;
                        }))
                });
            }
        ).catch(function(err) {
            res.status(500).json({
                status: 'error',
                message: err
            });
        });
    });
};
