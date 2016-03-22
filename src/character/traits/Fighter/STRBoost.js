
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('STR Boost I')
@classes({ Fighter: 1 })
@description('Gain a passive boost to STR.')
@family(ActionTypes.NONE)
@effect('STR+', { stats: { str: { multiplier: 0.04 } } })
export default class BasicSTRBoost extends Trait {

}