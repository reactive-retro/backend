
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Hide')
@cost(0)
@cooldown(1)
@classes({ Thief: 1 })
@targets(ActionTargets.SELF)
@description('Hide in the shadows, making yourself untargetable by foes')
export default class Hide extends Action {

}