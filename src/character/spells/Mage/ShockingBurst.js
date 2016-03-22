
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Shocking Burst')
@cost(26)
@cooldown(0)
@classes({ Mage: 13 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Zap your foe with the power of a live wire, dealing moderate damage and carrying a chance of shock and low chance of burn.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '2df([mnt] / 2) + f([mnt] / 6)' })
@effect('Shock', { chance: 35, roll: '1d4 + 1', string: 'round' })
@effect('Burn', { chance: 15, roll: '1d2 + 1', string: 'round' })
@unblockable
@targeting(damage)
@family([ActionTypes.ELECTRIC])
export default class ShockingBurst extends Action {

}