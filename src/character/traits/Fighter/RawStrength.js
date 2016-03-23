
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Raw Strength')
@classes({ Fighter: 17 })
@description('Gain a passive boost to all physical attack damage.')
@family(ActionTypes.PHYSICAL)
@effect('Physical+', { damage: { multiplier: 0.1 } })
export default class RawStrength extends Trait {

}