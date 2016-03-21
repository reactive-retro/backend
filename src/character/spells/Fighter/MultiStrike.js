
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Multi Strike')
@cost(0)
@cooldown(5)
@classes({ Fighter: 13 })
@targets(ActionTargets.ALL_ENEMY)
@description('Attack all enemies.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Damage', { roll: '2df([str] / 3) + f([str] / 7)' })
@targeting(damage)
export default class MultiStrike extends Action {

}