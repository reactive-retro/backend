
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Fire Affinity')
@classes({ Elementalist: 15 })
@description('Gain a passive boost to all fire-based attacks.')
@family(ActionTypes.FIRE)
@effect('Fire+', { damage: { multiplier: 0.2 }, duration: { boost: 2 }, cooldown: { boost: -1 }, cost: { multiplier: -0.25 } })
export default class BasicFireAffinity extends Trait {

}