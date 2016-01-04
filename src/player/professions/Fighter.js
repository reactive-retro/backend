
import Profession from '../base/Profession';

export default class Fighter extends Profession {
    static hp(player) { return this.getLevel(player) * 15; }
    static mp(player) { return this.getLevel(player) * 1; }
    static str(player) { return this.getLevel(player) * 3; }
    static int(player) { return this.getLevel(player) * 1; }
    static agi(player) { return this.getLevel(player) * 2; }
}
