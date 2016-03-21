
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Cold Snap')
@cost(32)
@cooldown(0)
@classes({ Mage: 16 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Chill your foe with an icy touch, dealing moderate damage and carrying a decent chance to freeze.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '2df([mnt] / 2) + f([mnt] / 6)' })
@effect('Freeze', { chance: 35, roll: '1d1', string: 'round' })
@unblockable
@targeting(damage)
export default class ColdSnap extends Action {

}