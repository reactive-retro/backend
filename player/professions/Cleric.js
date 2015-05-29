var Profession = require('../base/Profession');

class Cleric extends Profession {
    hp(player) { return player.level * 7; }
    mp(player) { return player.level * 3; }
};

module.exports = Cleric;