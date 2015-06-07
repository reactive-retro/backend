'use strict';

var _ = require('lodash');

var db = require('../../objects/db');
var MESSAGES = require('../../static/messages');
var save = require('../save');

var calculate = require('../calculate');

module.exports = function(socket) {
    socket.on('equip', function(options, respond) {

        if(!options.name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!options.itemId) {
            return respond({msg: MESSAGES.NO_ITEM});
        }

        db.players.findOne({name: options.name}, function(err, doc) {

            if(err) {
                return respond({msg: MESSAGES.GENERIC});
            }

            if(!doc) {
                return respond({msg: MESSAGES.NO_PLAYER});
            }

            var item = _.findWhere(doc.inventory, {itemId: options.itemId});

            if(!item) {
                return respond({msg: MESSAGES.BAD_ITEM});
            }

            // level requirements, maybe.

            doc.inventory.push(doc.equipment[item.type]);
            doc.inventory = _.without(doc.inventory, item);
            doc.equipment[item.type] = item;

            save(doc);

            respond(null, {msg: MESSAGES.EQUIP_SUCCESS, player: calculate(doc)});

        });

    });
};