
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('LUK Boost II')
@classes({ Dowser: 25 })
@description('Gain a passive boost to LUK.')
@family(ActionTypes.NONE)
@effect('LUK+', { stats: { luk: { multiplier: 0.07 } } })
export default class LUKBoost extends Trait {

}