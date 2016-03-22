
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, family } from '../../../static/decorators/spell';

@name('Hide')
@cost(0)
@cooldown(15)
@classes({ Thief: 10 })
@targets(ActionTargets.SELF)
@description('Hide in the shadows, making yourself temporarily invisible to foes. This effect is canceled if you do damage.')
@useString('%o hides in the shadows!')
@effect('Stealth', { roll: '1d5 + 5', string: 'round' })
@family([ActionTypes.BUFF])
export default class Hide extends Action {

}