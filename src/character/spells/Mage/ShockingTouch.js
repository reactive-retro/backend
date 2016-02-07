
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Shocking Touch')
@cost(10)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Zap your foe with the power of a badly-wired outlet, dealing low damage but carrying a chance of shock.')
@effect('Damage', { roll: '1df([mnt] / 2) + 1' })
@effect('Shock', { chance: 25, roll: '1d4 + 1', string: 'round' })
export default class ShockingTouch extends Action {

}