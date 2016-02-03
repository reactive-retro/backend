
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Steal')
@cost(0)
@cooldown(1)
@classes({ Thief: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Attempt to steal an item from a foe.')
export default class Steal extends Action {

}