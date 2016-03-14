
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk } from '../../static/decorators';

@hp(7, (prof, player) => Math.floor(prof.getStat(player, 'vit')))
@mp(4, (prof, player) => prof.getStat(player, 'mnt'))
@str(2)
@dex(1)
@vit(1.5)
@mnt(2)
@luk(0.5)
export default class Cleric extends Profession {
}