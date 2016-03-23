
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Magic Preserver')
@classes({ Mage: 34 })
@description('Conserve some MP when casting spells.')
@family(ActionTypes.MAGICAL)
@effect('Preserver', { cost: { multiplier: -0.15 } })
export default class MagicPreserver extends Trait {

}