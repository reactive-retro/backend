
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description } from '../../../static/decorators';

@name('Cold Touch')
@cost(15)
@cooldown(0)
@classes({ Mage: 1 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Chill your foe with an icy touch, dealing low damage but carrying a chance to freeze.')
export default class ColdTouch extends Action {

}