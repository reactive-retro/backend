
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('LUK Boost III')
@classes({ Dowser: 45 })
@description('Gain a passive boost to LUK.')
@family(ActionTypes.NONE)
@effect('LUK+', { stats: { luk: { multiplier: 0.1 } } })
export default class AdvancedLUKBoost extends Trait {

}