
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Cold Touch')
@cost(15)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Chill your foe with an icy touch, dealing low damage but carrying a chance to freeze.')
@effect('Damage', { roll: '1df([mnt] / 2) + 1' })
@effect('Freeze', { chance: 25, roll: '1d1', string: 'round' })
export default class ColdTouch extends Action {

}