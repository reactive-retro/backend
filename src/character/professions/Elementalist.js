
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk, prerequisite, description } from '../../static/decorators/profession';

@hp(8, (prof, player) => Math.floor(prof.getStat(player, 'vit') * 0.7))
@mp(6, (prof, player) => prof.getStat(player, 'mnt') * 3)
@str(3)
@dex(1)
@vit(1)
@mnt(3)
@luk(0.7)
@prerequisite({ Mage: 20 })
@description('Elementalists are debuff specialists, being able to back up their powerful spells with powerful physical attacks!')
export default class Elementalist extends Profession {
}