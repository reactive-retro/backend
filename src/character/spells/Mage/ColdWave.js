
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable } from '../../../static/decorators/spell';

@name('Cold Wave')
@cost(27)
@cooldown(0)
@classes({ Mage: 26 })
@targets(ActionTargets.ALL_ENEMY)
@description('Send out a wave of frost to all enemies, dealing low damage but carrying a chance to freeze.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '1df([mnt] / 2) + 1' })
@effect('Freeze', { chance: 20, roll: '1d1', string: 'round' })
@unblockable
export default class ColdWave extends Action {

}