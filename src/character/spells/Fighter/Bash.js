
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Bash')
@cost(0)
@cooldown(2)
@classes({ Fighter: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Deal minor damage to an enemy with a chance to stun them.')
export default class Bash extends Action {

}