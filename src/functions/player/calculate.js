
export default (player) => {
    var profession = require(`../../player/professions/${player.profession}`).default;
    player.stats.hp.max = profession.hp(player);
    player.stats.mp.max = profession.mp(player);
    player.equipment.profession = {
        stats: {
            str: profession.str(player),
            int: profession.int(player),
            agi: profession.agi(player),
            luk: profession.luk(player)
        }
    };
    return player;
};