
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable } from '../../../static/decorators/spell';

@name('Fireball')
@cost(22)
@cooldown(0)
@classes({ Mage: 11 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Hurl a ball of fire at your foe, dealing moderate damage and carrying a decent chance to burn.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '2df([mnt] / 2) + 1' })
@effect('Burn', { chance: 45, roll: '1d4 + 1', string: 'round' })
@unblockable
export default class Fireball extends Action {

}