
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting } from '../../../static/decorators/spell';
import { support } from '../../../static/decorators/aitarget';

@name('Minor Heal')
@cost(5)
@cooldown(0)
@classes({ Cleric: 5 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Provide a ray of support for an ally.')
@useString('%o healed %t for %d hp!')
@effect('Heal', { roll: '2df([mnt] / 6) + f([mnt] / 6)', string: 'HP', instant: true })
@targeting(support)
export default class MinorHeal extends Action {

}