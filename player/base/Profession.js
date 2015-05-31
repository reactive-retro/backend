'use strict';
class Profession {
    static hp(player) { return player.level * 10; }
    static mp() { return 0; }
};

module.exports = Profession;