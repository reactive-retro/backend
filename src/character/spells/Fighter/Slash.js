
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Slash')
@cost(0)
@cooldown(1)
@classes({ Fighter: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Slash an enemy, dealing medium damage with above-average accuracy.')
export default class Slash extends Action {

}