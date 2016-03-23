
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Ice Affinity')
@classes({ Elementalist: 25 })
@description('Gain a passive boost to all ice-based attacks.')
@family(ActionTypes.ICE)
@effect('Ice+', { damage: { multiplier: 0.2 }, duration: { boost: 1 }, cooldown: { boost: -1 }, cost: { multiplier: -0.25 } })
export default class BasicIceAffinity extends Trait {

}