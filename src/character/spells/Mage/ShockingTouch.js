
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Shocking Touch')
@cost(7)
@cooldown(0)
@classes({ Mage: 3 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Zap your foe with the power of a badly-wired outlet, dealing low damage but carrying a chance of shock.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '1df([mnt] / 2) + f([mnt] / 6)' })
@effect('Shock', { chance: 25, roll: '1d4 + 1', string: 'round' })
@unblockable
@targeting(damage)
@family([ActionTypes.ELECTRIC, ActionTypes.MAGICAL])
export default class ShockingTouch extends Action {

}