
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators';

@name('Eat Spinach')
@cost(0)
@cooldown(3)
@classes({ Fighter: 1 })
@targets(ActionTargets.SELF)
@description('Eat spinach, causing your muscles to bulge and your strength to go up by 5.')
@useString('%o used %n!')
@effect('STR+', { roll: '3d1', string: 'round' })
export default class EatSpinach extends Action {

}