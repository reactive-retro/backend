
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Fire Affinity')
@classes({ Mage: 1 })
@description('Gain a passive boost to all fire-based attacks.')
@family(ActionTypes.FIRE)
@effect('Fire+', { damage: { multiplier: 0.05 }, duration: { multiplier: 0.5 }, cooldown: {  multiplier: -0.5 }, cost: { multiplier: -0.5 } })
export default class BasicFireAffinity extends Trait {

}