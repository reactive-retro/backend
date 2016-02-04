
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Hide')
@cost(0)
@cooldown(1)
@classes({ Thief: 1 })
@targets(ActionTargets.SELF)
@description('Hide in the shadows, making yourself temporarily invisible to foes. This effect is canceled if you do damage.')
@effect('Stealth', { roll: '1d5 + 5', string: 'round' })
export default class Hide extends Action {

}