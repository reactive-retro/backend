
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, times, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Triple Tap')
@cost(0)
@cooldown(6)
@times(3)
@classes({ Fighter: 34 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Attack an enemy thrice.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '2df([str] / 4) + f([str] / 6)' })
@targeting(damage)
@family([ActionTypes.PHYSICAL])
export default class DoubleTap extends Action {

}