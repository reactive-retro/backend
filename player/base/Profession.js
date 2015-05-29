class Profession {
    hp(player) { return player.level * 10; }
    mp() { return 0; }
};

module.exports = Profession;