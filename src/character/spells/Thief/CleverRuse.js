
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Clever Ruse')
@cost(0)
@cooldown(2)
@classes({ Thief: 1 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Craft a clever ruse, raising evasion for one of your allies.')
@effect('SPD+', { roll: '3d1', string: 'round' })
export default class CleverRuse extends Action {

}