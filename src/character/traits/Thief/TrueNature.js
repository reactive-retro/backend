
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('True Nature')
@classes({ Thief: 17 })
@description('Steal things better.')
@family(ActionTypes.PHYSICAL)
@effect('Steal+', { effectDisplay: 'You now steal better.' })
export default class TrueNature extends Trait {

}