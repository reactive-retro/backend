
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { damage } from '../../../static/decorators/aitarget';

@name('Sunburst')
@cost(50)
@cooldown(2)
@classes({ Elementalist: 5 })
@targets(ActionTargets.SINGLE_ENEMY)
@description('Unleash the wrath of the sun on your opponent, burning them badly.')
@useString('%o used %n on %t!')
@effect('Burn', { chance: 90, roll: '1d5 + 5', string: 'round' })
@targeting(damage)
@family([ActionTypes.FIRE, ActionTypes.MAGICAL])
export default class Sunburst extends Action {

}