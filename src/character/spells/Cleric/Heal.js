
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators/spell';

@name('Heal')
@cost(30)
@cooldown(0)
@classes({ Cleric: 20 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Provide a burst of healing for an ally.')
@useString('%o healed %t for %d hp!')
@effect('Heal', { roll: '4df([mnt] / 6)', string: 'HP', instant: true })
export default class Heal extends Action {

}