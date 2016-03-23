
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Electric Affinity')
@classes({ Elementalist: 51 })
@description('Gain a passive boost to all electric-based attacks.')
@family(ActionTypes.ELECTRIC)
@effect('Electric+', { damage: { multiplier: 0.05 }, duration: { multiplier: 0.5 }, cooldown: {  multiplier: -0.5 }, cost: { multiplier: -0.5 } })
export default class BasicElectricAffinity extends Trait {

}