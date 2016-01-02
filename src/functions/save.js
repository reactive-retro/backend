'use strict';

var _ = require('lodash');
var dbPromise = require('../objects/db');

module.exports = function(player) {
    dbPromise().then(function(db) {
        var players = db.collection('players');
        players.update({name: player.name}, player, _.noop);
    });
};