
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Stunning Strike')
@classes({ Fighter: 34 })
@description('You sometimes leave a concussion when striking your foes.')
@family(ActionTypes.PHYSICAL)
@effect('Stun', { effect: { chance: 10, duration: 1 } })
export default class StunningStrike extends Trait {

}