
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk } from '../../static/decorators';

@hp(5)
@mp(10, (prof, player) => prof.getStat(player, 'mnt') * 2)
@str(1)
@dex(1)
@vit(1)
@mnt(2)
@luk(0.5)
export default class Mage extends Profession {
}
