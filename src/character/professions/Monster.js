
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk, description } from '../../static/decorators/profession';

@hp(5)
@mp(3)
@str(2)
@dex(2)
@vit(2)
@mnt(2)
@luk(0.3)
@description('Monsters are monsters.')
export default class Monster extends Profession {
}