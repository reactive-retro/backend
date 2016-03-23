
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, family } from '../../../static/decorators/spell';

@name('Warm Wave')
@cost(22)
@cooldown(0)
@classes({ Mage: 21 })
@targets(ActionTargets.ALL_ENEMY)
@description('Send out a wave of warmth to all enemies, dealing low damage but carrying a chance to burn.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '1df([mnt] / 2) + f([mnt] / 6)' })
@effect('Burn', { chance: 20, roll: '1d4 + 1', string: 'round' })
@unblockable
@family([ActionTypes.FIRE, ActionTypes.MAGICAL])
export default class WarmWave extends Action {

}