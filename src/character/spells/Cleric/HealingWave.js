
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators/spell';

@name('Healing Wave')
@cost(45)
@cooldown(0)
@classes({ Cleric: 17 })
@targets(ActionTargets.ALL_ALLY)
@description('Send out a wave of healing that reaches all allies.')
@useString('%o healed %t for %d hp!')
@effect('Heal', { roll: '3df([mnt] / 5)', string: 'HP', instant: true })
export default class HealingWave extends Action {

}