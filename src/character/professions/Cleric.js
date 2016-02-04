
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk } from '../../static/decorators';

@hp(7)
@mp(3, (prof, player) => prof.getStat(player, 'mnt'))
@str(2)
@dex(1)
@vit(1)
@mnt(2)
@luk(0.5)
export default class Cleric extends Profession {
    static hp(player) { return this.getLevel(player) * 7; }
    static mp(player) { return this.getLevel(player) * 3 + this.getStat(player, 'mnt'); }
    static str(player) { return this.getLevel(player) * 2; }
    static mnt(player) { return this.getLevel(player) * 2; }
    static dex(player) { return this.getLevel(player) * 1; }
    static vit(player) { return this.getLevel(player) * 1; }
}