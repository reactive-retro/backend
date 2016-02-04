
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect } from '../../../static/decorators';

@name('Meditate')
@cost(0)
@cooldown(1)
@classes({ Mage: 1 })
@targets(ActionTargets.SELF)
@description('Sit down in the middle of combat and begin meditating, restoring your MP.')
@effect('Refresh', { roll: 'f(1d[mp.max] / 4) + f([mp.max] / 4)', string: 'MP' })
export default class Meditate extends Action {

}