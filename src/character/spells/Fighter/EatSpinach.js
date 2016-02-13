
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString } from '../../../static/decorators';

@name('Eat Spinach')
@cost(0)
@cooldown(6)
@classes({ Fighter: 1 })
@targets(ActionTargets.SELF)
@description('Eat spinach, causing your muscles to bulge and your strength to go up by 5.')
@useString('%o pulled out a can of spinach, and ate it all!')
@effect('STR+', { roll: '3d1', statBuff: 5, string: 'round' })
export default class EatSpinach extends Action {

}