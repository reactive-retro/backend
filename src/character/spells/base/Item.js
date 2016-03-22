
import Action, { ActionTargets, ActionTypes } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unstackable, family } from '../../../static/decorators/spell';

@name('Item')
@cost(0)
@cooldown(0)
@classes({ All: 1 })
@targets(ActionTargets.ANY)
@description('Use an item.')
@useString('%o used %i on %t!')
@effect('Item', { chance: 100 })
@unstackable
@family([ActionTypes.SPECIAL])
export default class Item extends Action {

}