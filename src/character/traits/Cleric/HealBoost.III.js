
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Healing Boost III')
@classes({ Cleric: 41 })
@description('Gain a passive boost to all healing spells.')
@family(ActionTypes.HEAL)
@effect('Heal+', { damage: { multiplier: 0.15 } })
export default class AdvancedHealingBoost extends Trait {

}