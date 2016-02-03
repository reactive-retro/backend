
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Meditate')
@cost(0)
@cooldown(1)
@classes({ Mage: 1 })
@targets(ActionTargets.SELF)
@description('Sit down in the middle of combat and begin meditating, restoring your MP.')
export default class Meditate extends Action {

}