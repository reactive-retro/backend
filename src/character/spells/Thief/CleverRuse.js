
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, targeting, family } from '../../../static/decorators/spell';
import { support } from '../../../static/decorators/aitarget';

@name('Clever Ruse')
@cost(0)
@cooldown(6)
@classes({ Thief: 5 })
@targets(ActionTargets.SINGLE_ALLY)
@description('Craft a clever ruse, raising dexterity by 5 for one of your allies.')
@useString('%o created a %n for %t!')
@effect('DEX+', { roll: '3d1', statRoll: 5, string: 'round' })
@targeting(support)
@family([ActionTypes.BUFF])
export default class CleverRuse extends Action {

}