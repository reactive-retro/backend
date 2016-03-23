
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Mental Acuity')
@classes({ Mage: 17 })
@description('Gain a passive boost to all magical attack damage.')
@family(ActionTypes.MAGICAL)
@effect('Magical+', { damage: { multiplier: 0.1 } })
export default class MentalAcuity extends Trait {

}