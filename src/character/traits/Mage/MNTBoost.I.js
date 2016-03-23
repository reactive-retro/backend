
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('MNT Boost I')
@classes({ Mage: 1 })
@description('Gain a passive boost to MNT.')
@family(ActionTypes.NONE)
@effect('MNT+', { stats: { mnt: { multiplier: 0.03 } } })
export default class BasicMNTBoost extends Trait {

}