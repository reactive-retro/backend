
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Physical Boost I')
@classes({ Fighter: 1 })
@description('Gain a passive boost to all physical attack damage.')
@family(ActionTypes.PHYSICAL)
@effect('Physical+', { damage: { multiplier: 0.05 } })
export default class BasicPhysicalBoost extends Trait {

}