
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators/spell';

@name('Clever Ruse')
@cost(0)
@cooldown(6)
@classes({ Thief: 5 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Craft a clever ruse, raising dexterity by 5 for one of your allies.')
@useString('%o created a %n for %t!')
@effect('DEX+', { roll: '3d1', statRoll: 5, string: 'round' })
export default class CleverRuse extends Action {

}