'use strict';

var db = require('../objects/db');

module.exports = function(player) {
    db.update({name: player.name}, player);
};