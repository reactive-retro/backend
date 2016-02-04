
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk } from '../../static/decorators';

@hp(7, (prof, player) => prof.getStat(player, 'vit'))
@mp(3)
@str(2)
@dex(2)
@vit(1)
@mnt(1)
@luk(0.75)
export default class Thief extends Profession {
    static hp(player) { return this.getLevel(player) * 7 + this.getStat(player, 'vit'); }
    static mp(player) { return this.getLevel(player) * 3; }
    static str(player) { return this.getLevel(player) * 2; }
    static mnt(player) { return this.getLevel(player) * 2; }
    static dex(player) { return this.getLevel(player) * 1; }
    static vit(player) { return this.getLevel(player) * 1; }
}