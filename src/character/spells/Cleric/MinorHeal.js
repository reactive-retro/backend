
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators/spell';

@name('Minor Heal')
@cost(5)
@cooldown(0)
@classes({ Cleric: 2 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Provide an ally with a ray of healing.')
@useString('%o healed %t for %d hp!')
@effect('Heal', { roll: '2df([mnt] / 6)', string: 'HP', instant: true })
export default class MinorHeal extends Action {

}