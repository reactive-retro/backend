
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unblockable, targeting } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Shadow Stab')
@cost(0)
@cooldown(3)
@classes({ Thief: 15 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Stab an enemy from the shadows. Does not remove stealth, and does more damage if stealthed.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { chance: 105, roll: '2df([str] / 2) + f([str] / 6)', displayName: 'Shadow Stab', spareEffect: 'Stealth', bonusEffect: 'Stealth', bonusMultiplier: 1.5 })
@unblockable
@targeting(damage)
export default class ShadowStab extends Action {

}