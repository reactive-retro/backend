
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Arctic Winds')
@cost(100)
@cooldown(3)
@classes({ Elementalist: 45 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Bring the winds of the arctic upon your foe, freezing them solid for an extended period of time.')
@useString('%o used %n on %t!')
@effect('Freeze', { chance: 80, roll: '1d4 + 3', string: 'round' })
@targeting(damage)
@family([ActionTypes.ICE, ActionTypes.MAGICAL])
export default class ArcticWinds extends Action {

}