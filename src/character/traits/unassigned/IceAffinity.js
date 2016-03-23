
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Ice Affinity')
@classes({ Elementalist: 51 })
@description('Gain a passive boost to all ice-based attacks.')
@family(ActionTypes.ICE)
@effect('Ice+', { damage: { boost: 10 }, duration: { boost: 1 }, cooldown: { boost: -1 }, cost: { boost: -3 } })
export default class BasicIceAffinity extends Trait {

}