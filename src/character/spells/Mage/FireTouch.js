
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Fire Touch')
@cost(5)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Scorch your foe with a small flame, dealing low damage but carrying a chance to burn.')
@effect('Damage', { roll: 'f(1d[mnt] / 2) + 1' })
@effect('Burn', { chance: 25, roll: '1d4 + 1', string: 'round' })
export default class FireTouch extends Action {

}