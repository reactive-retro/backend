'use strict';

var _ = require('lodash');

var db = require('../../objects/db');
var MESSAGES = require('../../static/messages');

var places = new require('googleplaces')(process.env.GOOGLE_PLACES_API_KEY, 'json');

var calcDistanceBetween = require('../helpers').calcDistanceBetween;

module.exports = function(socket) {

    var RADIUS = 1000; //1.0km~0.6mi
    var REFRESH = 0.3; //0.3km~0.2mi

    // expect {lat, long, name}
    socket.on('nearby', function(options, respond) {
        places.placeSearch({location: [options.latitude, options.longitude], radius: RADIUS}, function(err, res) {

            if(err) {
                respond({msg: err});
            }

            var places = _.map(res.results, _.partialRight(_.pick, ['geometry', 'id', 'name', 'types']));

            // load player, check only last coordinates

            var sendPlaces = function() {
                respond(null, {msg: 'New places', places: places});
                updateLastPosition();
            };

            var updateLastPosition = function() {
                db.players.update({name: options.name}, {$set: {lastCoordinateRefresh: [options.latitude, options.longitude]}});
            };

            db.players.find({name: options.name}, {lastCoordinateRefresh: 1}, function(err, res) {

                if(!res.lastCoordinateRefresh) {
                    res.lastCoordinateRefresh = [options.latitude, options.longitude];
                    sendPlaces();
                } else {
                    var distance = calcDistanceBetween(
                        options.latitude,             options.longitude,
                        res.lastCoordinateRefresh[0], res.lastCoordinateRefresh[1]);

                    sendPlaces();
                }

            });
        });
    });
};