
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Steal')
@cost(0)
@cooldown(1)
@classes({ Thief: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Attempt to steal an item from a foe.')
@useString('%o attempted to steal items from %t!')
@effect('Steal', { chance: 75, roll: '1d1', string: 'item' })
@targeting(damage)
@family([ActionTypes.SPECIAL])
export default class Steal extends Action {

}