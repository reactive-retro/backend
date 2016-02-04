
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Slash')
@cost(0)
@cooldown(1)
@classes({ Fighter: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Slash an enemy, dealing medium damage with above-average accuracy.')
@effect('Damage', { chance: 85, roll: '2df([str] / 2) + 2' })
export default class Slash extends Action {

}