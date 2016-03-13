
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, disabled } from '../../../static/decorators';

@name('Hide')
@cost(0)
@cooldown(15)
@classes({ Thief: 10 })
@targets(ActionTargets.SELF)
@description('Hide in the shadows, making yourself temporarily invisible to foes, but only if you have living allies. This effect is canceled if you do damage.')
@useString('%o hides in the shadows!')
@effect('Stealth', { roll: '1d5 + 5', string: 'round' })
@disabled
export default class Hide extends Action {

}