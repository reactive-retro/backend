
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Libra')
@cost(10)
@cooldown(0)
@classes({ Dowser: 5 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Learn more about an enemy.')
@useString('%o used %n on %t!')
@effect('Libra', { chance: 100, roll: '0d0', string: '' })
@targeting(damage)
@family([ActionTypes.SPECIAL])
export default class Libra extends Action {

}