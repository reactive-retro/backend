
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('MNT Boost II')
@classes({ Mage: 21 })
@description('Gain a passive boost to MNT.')
@family(ActionTypes.NONE)
@effect('MNT+', { stats: { mnt: { multiplier: 0.07 } } })
export default class MNTBoost extends Trait {

}