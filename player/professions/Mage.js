'use strict';

var Profession = require('../base/Profession');

class Mage extends Profession {
    static hp(player) { return player.level * 5; }
    static mp(player) { return player.level * 5; }
};

module.exports = Mage;