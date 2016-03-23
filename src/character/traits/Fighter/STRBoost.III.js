
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('STR Boost III')
@classes({ Fighter: 41 })
@description('Gain a passive boost to STR.')
@family(ActionTypes.NONE)
@effect('STR+', { stats: { str: { multiplier: 0.1 } } })
export default class AdvancedSTRBoost extends Trait {

}