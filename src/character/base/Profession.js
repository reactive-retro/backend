
import _ from 'lodash';

export default class Profession {
    static getLevel(player) { return player.professionLevels[player.profession]; }
    static getStat(player, stat) { return _.reduce(player.equipment, (prev, item) => prev + (item.stats[stat] || 0), 0); }
    static hp(player) { return this.getLevel(player) * 10; }
    static mp() { return 0; }
    static str() { return 1; }
    static mnt() { return 1; }
    static dex() { return 1; }
    static vit() { return 1; }
    static luk() { return 1; }
}