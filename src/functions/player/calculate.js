
import _ from 'lodash';

export default (player) => {
    var profession = require(`../../character/professions/${player.profession}`).default;
    player.equipment.profession = {
        stats: {
            str: profession.str(player),
            mnt: profession.mnt(player),
            dex: profession.dex(player),
            vit: profession.vit(player),
            luk: profession.luk(player)
        }
    };

    _.each(['str', 'mnt', 'dex', 'vit', 'luk'], stat => {
        player.stats[stat] = profession.getStat(player, stat);
    });

    player.stats.hp.max = profession.hp(player);
    player.stats.mp.max = profession.mp(player);
    return player;
};