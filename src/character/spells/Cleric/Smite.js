
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Smite')
@cost(5)
@cooldown(0)
@classes({ Cleric: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Blast your foe with holy light.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '1df([mnt]) + f([mnt] / 6)' })
@effect('Burn', { chance: 15, roll: '1d2 + 1', string: 'round' })
@unblockable
@targeting(damage)
export default class Smite extends Action {

}