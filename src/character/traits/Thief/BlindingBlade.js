
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Blinding Blade')
@classes({ Thief: 34 })
@description('You sometimes have enough pocket sand to throw at enemies while stabbing them.')
@family(ActionTypes.PHYSICAL)
@effect('Blind', { effect: { chance: 10, duration: 1 } })
export default class BlindingBlade extends Trait {

}