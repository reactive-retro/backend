'use strict';

var _ = require('lodash');

var dbPromise = require('../../objects/db');
var MESSAGES = require('../../static/messages');
var save = require('../save');

var calculate = require('../calculate');
var fullheal = require('../fullheal');

module.exports = function(socket) {

    // expect {name, newProfession}
    socket.on('classchange', function(options, respond) {

        if(!options.name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!options.newProfession) {
            return respond({msg: MESSAGES.NO_CLASS});
        }

        dbPromise().then(function(db) {
            var players = db.collection('players');
            players.findOne({name: options.name}, function(err, doc) {

                if(err) {
                    return respond({msg: MESSAGES.GENERIC});
                }

                if(!doc) {
                    return respond({msg: MESSAGES.NO_PLAYER});
                }

                if(!_.contains(doc.unlockedProfessions, options.newProfession)) {
                    return respond({msg: MESSAGES.INVALID_PROF});
                }

                if(!doc.professionLevels[options.newProfession]) {
                    doc.professionLevels[options.newProfession] = 1;
                }

                doc.profession = options.newProfession;

                save(doc);

                respond(null, {msg: MESSAGES.PROF_CHANGE_SUCCESS, player: fullheal(calculate(doc))});

            });
        });

    });
};