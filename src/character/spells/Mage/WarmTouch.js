
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Warm Touch')
@cost(5)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Scorch your foe with a small flame, dealing low damage but carrying a chance to burn.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '1df([mnt] / 2) + 1' })
@effect('Burn', { chance: 25, roll: '1d4 + 1', string: 'round' })
@unblockable
@targeting(damage)
export default class WarmTouch extends Action {

}