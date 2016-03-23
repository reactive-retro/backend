
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('DEX Boost III')
@classes({ Thief: 41 })
@description('Gain a passive boost to DEX.')
@family(ActionTypes.NONE)
@effect('DEX+', { stats: { mnt: { multiplier: 0.1 } } })
export default class AdvancedDEXBoost extends Trait {

}