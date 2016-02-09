
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators';

@name('Steal')
@cost(0)
@cooldown(1)
@classes({ Thief: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Attempt to steal an item from a foe.')
@useString('%o used %n on %t and stole %r!')
@effect('Steal', { chance: 50, roll: '1d1', string: 'item' })
export default class Steal extends Action {

}