var Profession = require('../base/Profession');

class Mage extends Profession {
    hp(player) { return player.level * 5; }
    mp(player) { return player.level * 5; }
};

module.exports = Mage;