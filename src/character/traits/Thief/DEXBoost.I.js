
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('DEX Boost I')
@classes({ Thief: 1 })
@description('Gain a passive boost to DEX.')
@family(ActionTypes.NONE)
@effect('DEX+', { stats: { mnt: { multiplier: 0.03 } } })
export default class BasicDEXBoost extends Trait {

}