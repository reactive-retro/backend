
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, family } from '../../../static/decorators/spell';

@name('Meditate')
@cost(0)
@cooldown(10)
@classes({ Mage: 1 })
@targets(ActionTargets.SELF)
@description('Sit down in the middle of combat and begin meditating, restoring your MP.')
@useString('%o began meditating!')
@effect('Refresh', { roll: '1df([mp.maximum] / 4) + f([mp.maximum] / 4)', string: 'MP', instant: true })
@family([ActionTypes.HEAL])
export default class Meditate extends Action {

}