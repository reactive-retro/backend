
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('1.21 Gigawatts')
@cost(75)
@cooldown(2)
@classes({ Elementalist: 25 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Send a powerful shock through your opponent, leaving them shocked for an extended period of time.')
@useString('%o used %n on %t!')
@effect('Shock', { chance: 85, roll: '1d7 + 3', string: 'round' })
@targeting(damage)
@family([ActionTypes.ELECTRIC, ActionTypes.MAGICAL])
export default class Gigawatts extends Action {

}