
export default (player) => {
    var profession = require(`../../character/professions/${player.profession}`).default;
    player.stats.hp.max = profession.hp(player);
    player.stats.mp.max = profession.mp(player);
    player.equipment.profession = {
        stats: {
            str: profession.str(player),
            mnt: profession.mnt(player),
            dex: profession.dex(player),
            vit: profession.vit(player),
            luk: profession.luk(player)
        }
    };
    return player;
};