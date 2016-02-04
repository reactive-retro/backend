
import Profession from '../base/Profession';
import { hp, mp, str, dex, vit, mnt, luk } from '../../static/decorators';

@hp(2)
@mp(3)
@str(1)
@dex(1)
@vit(1)
@mnt(2)
@luk(0.3)
export default class Monster extends Profession {
}