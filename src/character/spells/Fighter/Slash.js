
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Slash')
@cost(0)
@cooldown(3)
@classes({ Fighter: 7 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Slash an enemy, dealing medium damage with above-average accuracy.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { chance: 85, roll: '2df([str] / 2) + 2' })
@targeting(damage)
export default class Slash extends Action {

}