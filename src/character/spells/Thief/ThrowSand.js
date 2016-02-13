
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators';

@name('Throw Sand')
@cost(0)
@cooldown(2)
@classes({ Thief: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Throw some of your pocket sand at an enemy, blinding them momentarily.')
@useString('%o used %n on %t and inflicted momentary blindness!')
@effect('Blind', { roll: '1d1', string: 'round' })
export default class ThrowSand extends Action {

}