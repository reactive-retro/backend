
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk, prerequisite, description } from '../../static/decorators/profession';

@hp(7, (prof, player) => Math.floor(prof.getStat(player, 'vit')))
@mp(4, (prof, player) => prof.getStat(player, 'mnt'))
@str(2)
@dex(1)
@vit(1.5)
@mnt(2)
@luk(0.5)
@prerequisite({ Mage: 5 })
@description('Clerics are specialists in healing, but can also do some damage to foes!')
export default class Cleric extends Profession {
}