
import Action, { ActionTargets } from '../../base/Action';
import { name, cost, cooldown, classes, targets, description, effect, useString, unstackable } from '../../../static/decorators/spell';

@name('Flee')
@cost(0)
@cooldown(0)
@classes({ All: 1 })
@targets(ActionTargets.ALL_ALLY)
@description('Flee from combat.')
@useString('%o fled from combat!')
@effect('Flee', { chance: 100 })
@unstackable
export default class Flee extends Action {

}