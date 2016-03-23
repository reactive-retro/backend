
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('DEX Boost II')
@classes({ Thief: 21 })
@description('Gain a passive boost to DEX.')
@family(ActionTypes.NONE)
@effect('DEX+', { stats: { mnt: { multiplier: 0.07 } } })
export default class DEXBoost extends Trait {

}