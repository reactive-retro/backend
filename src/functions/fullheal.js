'use strict';

module.exports = function(player) {
    var profession = require(`../player/professions/${player.profession}`);
    player.stats.hp.cur = profession.hp(player);
    player.stats.mp.cur = profession.mp(player);
    return player;
};