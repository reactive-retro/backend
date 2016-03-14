
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk, description } from '../../static/decorators/profession';

@hp(5)
@mp(3)
@str(1)
@dex(1)
@vit(1)
@mnt(2)
@luk(0.3)
@description('Monsters are monsters.')
export default class Monster extends Profession {
}