
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets } from '../../../static/decorators';

@name('Fire Touch')
@cost(5)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
export default class FireTouch extends Action {

}