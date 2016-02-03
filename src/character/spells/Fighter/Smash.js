
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Smash')
@cost(0)
@cooldown(3)
@classes({ Fighter: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Smash an enemy, dealing low damage with very high accuracy.')
export default class Smash extends Action {

}