
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Electric Affinity')
@classes({ Elementalist: 20 })
@description('Gain a passive boost to all electric-based attacks.')
@family(ActionTypes.ELECTRIC)
@effect('Electric+', { damage: { multiplier: 0.2 }, duration: { boost: 2 }, cooldown: { boost: -1 }, cost: { multiplier: -0.25 } })
export default class BasicElectricAffinity extends Trait {

}