
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Salvager II')
@classes({ Dowser: 30 })
@description('Find items more often when killing enemies.')
@family(ActionTypes.NONE)
@effect('Item+', { effectDisplay: '+10% item find', stats: { itemgain: { boost: 10 } } })
export default class Salvager extends Trait {

}