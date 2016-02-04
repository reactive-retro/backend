
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Bash')
@cost(0)
@cooldown(2)
@classes({ Fighter: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Deal low damage to an enemy with a chance to stun them.')
@effect('Stun', { chance: 25, roll: '1d1', string: 'round' })
@effect('Damage', { roll: '1df([str] / 2) + 1' })
export default class Bash extends Action {

}