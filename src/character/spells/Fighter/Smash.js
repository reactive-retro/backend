
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Smash')
@cost(0)
@cooldown(3)
@classes({ Fighter: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Smash an enemy, dealing low damage with very high accuracy.')
@effect('Damage', { chance: 120, roll: '1df([str] / 2) + 1' })
export default class Smash extends Action {

}