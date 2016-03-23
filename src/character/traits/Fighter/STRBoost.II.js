
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('STR Boost II')
@classes({ Fighter: 21 })
@description('Gain a passive boost to STR.')
@family(ActionTypes.NONE)
@effect('STR+', { stats: { str: { multiplier: 0.07 } } })
export default class STRBoost extends Trait {

}