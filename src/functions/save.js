'use strict';

var db = require('../objects/db');

module.exports = function(player) {
    db.players.update({name: player.name}, player);
};