
import _ from 'lodash';

import { hp, mp, str, dex, vit, mnt, luk, acc } from '../../static/decorators/profession';

@hp(10)
@mp(0)
@str(1)
@dex(1)
@vit(1)
@mnt(1)
@luk(1)
@acc(0)
export default class Profession {
    static getStat(player, stat) { return _.reduce(player.equipment, (prev, item) => prev + (item.stats[stat] || 0), 0); }
}