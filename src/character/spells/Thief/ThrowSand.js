
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Throw Sand')
@cost(0)
@cooldown(3)
@classes({ Thief: 2 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Throw some of your pocket sand at an enemy, blinding them momentarily.')
@useString('%o used %n on %t and inflicted momentary blindness!')
@effect('Blind', { roll: '1d1', string: 'round' })
@targeting(damage)
export default class ThrowSand extends Action {

}