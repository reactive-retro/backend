
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Bash')
@cost(0)
@cooldown(2)
@classes({ Fighter: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Deal low damage to an enemy with a chance to stun them.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Stun', { chance: 25, roll: '1d1', string: 'round' })
@effect('Damage', { roll: '1df([str] / 4) + f([str] / 7)' })
@targeting(damage)
@family([ActionTypes.PHYSICAL])
export default class Bash extends Action {

}