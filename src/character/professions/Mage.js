
import Profession from '../base/Profession';

export default class Mage extends Profession {
    static hp(player) { return this.getLevel(player) * 5; }
    static mp(player) { return this.getLevel(player) * 5; }
    static str(player) { return this.getLevel(player) * 1; }
    static mnt(player) { return this.getLevel(player) * 2; }
    static dex(player) { return this.getLevel(player) * 1; }
    static vit(player) { return this.getLevel(player) * 1; }
}