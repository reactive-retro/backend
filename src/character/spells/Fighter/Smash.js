
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Smash')
@cost(0)
@cooldown(2)
@classes({ Fighter: 3 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Smash an enemy, dealing low damage with very high accuracy.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { chance: 120, roll: '1df([str] / 2) + f([str] / 9)' })
@targeting(damage)
@family([ActionTypes.PHYSICAL])
export default class Smash extends Action {

}