
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators';

@name('Slash')
@cost(0)
@cooldown(3)
@classes({ Fighter: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Slash an enemy, dealing medium damage with above-average accuracy.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { chance: 85, roll: '2df([str] / 2) + 2' })
export default class Slash extends Action {

}