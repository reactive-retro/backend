
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Healing Boost I')
@classes({ Cleric: 1 })
@description('Gain a passive boost to all healing spells.')
@family(ActionTypes.HEAL)
@effect('Heal+', { damage: { multiplier: 0.05 } })
export default class BasicHealingBoost extends Trait {

}