
import Profession from '../base/Profession';

export default class Thief extends Profession {
    static hp(player) { return this.getLevel(player) * 7 + this.getStat(player, 'vit'); }
    static mp(player) { return this.getLevel(player) * 3; }
    static str(player) { return this.getLevel(player) * 2; }
    static mnt(player) { return this.getLevel(player) * 2; }
    static dex(player) { return this.getLevel(player) * 1; }
    static vit(player) { return this.getLevel(player) * 1; }
}