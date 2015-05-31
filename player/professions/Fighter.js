var Profession = require('../base/Profession');

class Fighter extends Profession {
    static hp(player) { return player.level * 15; }
    static mp(player) { return player.level * 1; }
};

module.exports = Fighter;