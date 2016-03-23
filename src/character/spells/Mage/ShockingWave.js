
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, family } from '../../../static/decorators/spell';

@name('Shocking Wave')
@cost(24)
@cooldown(0)
@classes({ Mage: 23 })
@targets(ActionTargets.ALL_ENEMY)
@description('Send out a wave of electricity to all enemies, dealing low damage but carrying a chance of shock.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '1df([mnt] / 2) + f([mnt] / 6)' })
@effect('Shock', { chance: 20, roll: '1d4 + 1', string: 'round' })
@unblockable
@family([ActionTypes.ELECTRIC, ActionTypes.MAGICAL])
export default class ShockingWave extends Action {

}