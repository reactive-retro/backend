
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('MNT Boost III')
@classes({ Mage: 41 })
@description('Gain a passive boost to MNT.')
@family(ActionTypes.NONE)
@effect('MNT+', { stats: { mnt: { multiplier: 0.1 } } })
export default class AdvancedMNTBoost extends Trait {

}