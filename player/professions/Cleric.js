var Profession = require('../base/Profession');

class Cleric extends Profession {
    static hp(player) { return player.level * 7; }
    static mp(player) { return player.level * 3; }
};

module.exports = Cleric;