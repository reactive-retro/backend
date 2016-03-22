
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { support } from '../../../static/decorators/aitarget';

@name('Heal')
@cost(30)
@cooldown(0)
@classes({ Cleric: 20 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Provide a burst of support for an ally.')
@useString('%o healed %t for %d hp!')
@effect('Heal', { roll: '4df([mnt] / 6) + f([mnt] / 6)', string: 'HP', instant: true })
@targeting(support)
@family([ActionTypes.HEAL])
export default class Heal extends Action {

}