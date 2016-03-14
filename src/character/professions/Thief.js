
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk, acc, description } from '../../static/decorators/profession';

@hp(7, (prof, player) => prof.getStat(player, 'vit'))
@mp(3)
@str(2)
@dex(2)
@vit(1)
@mnt(1)
@luk(0.75)
@acc(0.5)
@description('Thieves are quick strikers and stealthy debuffers.')
export default class Thief extends Profession {
}