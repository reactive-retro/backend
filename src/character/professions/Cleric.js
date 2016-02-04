
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
}