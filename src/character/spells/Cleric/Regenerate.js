
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { support } from '../../../static/decorators/aitarget';

@name('Regenerate')
@cost(30)
@cooldown(0)
@classes({ Cleric: 13 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Cast a regenerative aura on an ally.')
@useString('%o cast %n on %t!')
@effect('Regenerate', { chance: 100, roll: '1d4 + 3', string: 'round' })
@targeting(support)
@family([ActionTypes.BUFF])
export default class Regenerate extends Action {

}