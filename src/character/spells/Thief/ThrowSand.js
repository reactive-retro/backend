
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Throw Sand')
@cost(0)
@cooldown(1)
@classes({ Thief: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Throw some of your pocket sand at an enemy, blinding them momentarily.')
export default class ThrowSand extends Action {

}