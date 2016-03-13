
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unstackable } from '../../../static/decorators';

@name('Attack')
@cost(0)
@cooldown(0)
@classes({ All: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Attack your foe with your weapon.')
@useString('%o attacked %t and dealt %d damage!')
@effect('Damage', { roll: '1df([str] / 2) + f([str] / 6)' })
@unstackable
export default class Attack extends Action {

}