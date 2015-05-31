'use strict';

module.exports = function(player) {
    var profession = require(`../player/professions/${player.profession}`);
    return player;
};