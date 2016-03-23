
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk, prerequisite, description } from '../../static/decorators/profession';

@hp(5, (prof, player) => Math.floor(prof.getStat(player, 'vit') * 0.3))
@mp(5, (prof, player) => prof.getStat(player, 'mnt') * 2)
@str(1)
@dex(1)
@vit(1)
@mnt(2)
@luk(2.5)
@prerequisite({ Thief: 25, Mage: 15 })
@description('Dowsers are incredible loot finders. Their abilities to get more gold and items are staggering and unprecedented. As a result, their combat skills are lacking.')
export default class Dowser extends Profession {
}