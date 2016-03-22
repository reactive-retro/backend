
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { support } from '../../../static/decorators/aitarget';

@name('Major Heal')
@cost(100)
@cooldown(0)
@classes({ Cleric: 40 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Provide a powerful surge of support for an ally.')
@useString('%o healed %t for %d hp!')
@effect('Heal', { roll: '6df([mnt] / 6) + f([mnt] / 6)', string: 'HP', instant: true })
@targeting(support)
@family([ActionTypes.HEAL])
export default class MajorHeal extends Action {

}