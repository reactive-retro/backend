
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Warm Touch')
@cost(5)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Scorch your foe with a small flame, dealing low damage but carrying a chance to burn.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '1df([mnt] / 2) + f([mnt] / 6)' })
@effect('Burn', { chance: 25, roll: '1d4 + 1', string: 'round' })
@unblockable
@targeting(damage)
@family([ActionTypes.FIRE])
export default class WarmTouch extends Action {

}