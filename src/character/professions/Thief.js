
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
}