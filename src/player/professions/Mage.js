
import Profession from '../base/Profession';

export default class Mage extends Profession {
    static hp(player) { return this.getLevel(player) * 5; }
    static mp(player) { return this.getLevel(player) * 5; }
    static str(player) { return this.getLevel(player) * 1; }
    static int(player) { return this.getLevel(player) * 4; }
    static agi(player) { return this.getLevel(player) * 1; }
}