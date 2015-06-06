'use strict';

var Profession = require('../base/Profession');

class Cleric extends Profession {
    static hp(player) { return this.getLevel(player) * 7; }
    static mp(player) { return this.getLevel(player) * 3; }
    static str(player) { return this.getLevel(player) * 2; }
    static int(player) { return this.getLevel(player) * 2; }
    static agi(player) { return this.getLevel(player) * 1; }
};

module.exports = Cleric;