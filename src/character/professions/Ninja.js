
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk, prerequisite, description } from '../../static/decorators/profession';

@hp(8, (prof, player) => Math.floor(prof.getStat(player, 'vit') * 0.7))
@mp(3, (prof, player) => prof.getStat(player, 'mnt'))
@str(2)
@dex(3)
@vit(1.3)
@mnt(2)
@luk(1)
@prerequisite({ Thief: 20 })
@description('Ninjas are advanced thieves and deadly assassins. They improve upon stealth and bring accuracy buffs to the party.')
export default class Ninja extends Profession {
}