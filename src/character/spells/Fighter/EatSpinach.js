
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Eat Spinach')
@cost(0)
@cooldown(3)
@classes({ Fighter: 1 })
@targets(ActionTargets.SELF)
@description('Eat spinach, causing your muscles to bulge and your strength to go up by 5.')
export default class EatSpinach extends Action {

}