'use strict';

var _ = require('lodash');

var dbPromise = require('../../objects/db');
var MESSAGES = require('../../static/messages');
var save = require('../save');

var calculate = require('../calculate');

module.exports = function(socket) {

    // expect {name, homepoint}
    socket.on('homepoint', function(options, respond) {

        if(!options.name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!options.homepoint || !options.homepoint.lat || !options.homepoint.lon) {
            return respond({msg: MESSAGES.NO_HOMEPOINT});
        }

        dbPromise().then(function(db) {
            var players = db.collection('players');
            players.findOne({name: options.name}, function (err, doc) {

                if (err) {
                    return respond({msg: MESSAGES.GENERIC});
                }

                if (!doc) {
                    return respond({msg: MESSAGES.NO_PLAYER});
                }

                doc.homepoint = options.homepoint;

                save(doc);

                respond(null, {msg: MESSAGES.HOMEPOINT_CHANGE_SUCCESS, player: calculate(doc)});

            });
        });

    });
};