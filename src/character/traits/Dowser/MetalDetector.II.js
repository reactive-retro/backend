
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Metal Detector II')
@classes({ Dowser: 40 })
@description('Find more gold when killing enemies.')
@family(ActionTypes.NONE)
@effect('Gold+', { effectDisplay: '+50% gold found', stats: { goldgain: { boost: 25 } } })
export default class MetalDetector extends Trait {

}