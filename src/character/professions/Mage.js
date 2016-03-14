
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk, description } from '../../static/decorators/profession';

@hp(6, (prof, player) => Math.floor(prof.getStat(player, 'vit') / 2))
@mp(10, (prof, player) => prof.getStat(player, 'mnt') * 2)
@str(1)
@dex(1)
@vit(2)
@mnt(3)
@luk(0.5)
@description('Mages are the foremost experts in elemental magic, flinging it at all who stand in their way.')
export default class Mage extends Profession {
}
