
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators/spell';

@name('Major Heal')
@cost(100)
@cooldown(0)
@classes({ Cleric: 40 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Provide a powerful surge of healing for an ally.')
@useString('%o healed %t for %d hp!')
@effect('Heal', { roll: '6df([mnt] / 6)', string: 'HP', instant: true })
export default class MajorHeal extends Action {

}