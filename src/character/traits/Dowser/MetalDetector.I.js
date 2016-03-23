
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Metal Detector I')
@classes({ Dowser: 10 })
@description('Find more gold when killing enemies.')
@family(ActionTypes.NONE)
@effect('Gold+', { effectDisplay: '+25% gold found', stats: { goldgain: { boost: 25 } } })
export default class BasicMetalDetector extends Trait {

}