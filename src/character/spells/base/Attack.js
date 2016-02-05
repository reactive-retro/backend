
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Attack')
@cost(0)
@cooldown(0)
@classes({})
@targets(ActionTargets.SINGLE_ENEMY)
@effect('Damage', { roll: '1df([str] / 2) + 1' })
export default class Attack extends Action {

}