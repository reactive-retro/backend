
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Sweep Strike')
@cost(0)
@cooldown(5)
@classes({ Fighter: 21 })
@targets(ActionTargets.ALL_ENEMY)
@description('Sweep your weapon towards all of your enemies and knock them down, possibly stunning them.')
@useString('%o used %n on %t and dealt %d damage!')
@effect('Stun', { chance: 40, roll: '1d1', string: 'round' })
@effect('Damage', { roll: '1df([str] / 4) + f([str] / 8)' })
@targeting(damage)
@family([ActionTypes.PHYSICAL])
export default class SweepStrike extends Action {

}