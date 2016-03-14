
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk } from '../../static/decorators';

@hp(10, (prof, player) => prof.getStat(player, 'vit') * 1.5)
@mp(1)
@str(3)
@dex(1.5)
@vit(1)
@mnt(2)
@luk(0.5)
export default class Fighter extends Profession {
}
