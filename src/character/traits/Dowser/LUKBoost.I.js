
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('LUK Boost I')
@classes({ Dowser: 5 })
@description('Gain a passive boost to LUK.')
@family(ActionTypes.NONE)
@effect('LUK+', { stats: { luk: { multiplier: 0.03 } } })
export default class BasicLUKBoost extends Trait {

}