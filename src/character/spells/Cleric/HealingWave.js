
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, family } from '../../../static/decorators/spell';

@name('Healing Wave')
@cost(45)
@cooldown(0)
@classes({ Cleric: 17 })
@targets(ActionTargets.ALL_ALLY)
@description('Send out a wave of support that reaches all allies.')
@useString('%o healed %t for %d hp!')
@effect('Heal', { roll: '3df([mnt] / 5) + f([mnt] / 5)', string: 'HP', instant: true })
@family([ActionTypes.HEAL])
export default class HealingWave extends Action {

}