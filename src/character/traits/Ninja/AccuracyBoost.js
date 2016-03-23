
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Accuracy Boost')
@classes({ Ninja: 5 })
@description('Gain a passive boost to all physical attack accuracy.')
@family(ActionTypes.PHYSICAL)
@effect('Hit%+', { hitchance: { multiplier: 0.1 } })
export default class BasicAccuracyBoost extends Trait {

}