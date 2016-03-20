
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, times } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Triple Tap')
@cost(0)
@cooldown(6)
@times(3)
@classes({ Fighter: 34 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Attack an enemy twice.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '2df([str] / 4) + 1' })
@targeting(damage)
export default class DoubleTap extends Action {

}