
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Fireball')
@cost(22)
@cooldown(0)
@classes({ Mage: 11 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Hurl a ball of fire at your foe, dealing moderate damage and carrying a decent chance to burn.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '2df([mnt] / 2) + f([mnt] / 6)' })
@effect('Burn', { chance: 45, roll: '1d4 + 1', string: 'round' })
@unblockable
@targeting(damage)
@family([ActionTypes.FIRE, ActionTypes.MAGICAL])
export default class Fireball extends Action {

}