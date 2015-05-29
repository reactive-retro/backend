var Profession = require('../base/Profession');

class Fighter extends Profession {
    hp(player) { return player.level * 15; }
    mp(player) { return player.level * 1; }
};

module.exports = Fighter;