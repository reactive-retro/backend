
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Shocking Touch')
@cost(10)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Zap your foe with the power of a badly-wired outlet, dealing low damage but carrying a chance of paralysis.')
export default class ShockingTouch extends Action {

}