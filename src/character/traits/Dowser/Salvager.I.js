
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Salvager I')
@classes({ Dowser: 5 })
@description('Find items more often when killing enemies.')
@family(ActionTypes.NONE)
@effect('Item+', { effectDisplay: '+5% item find', stats: { itemgain: { boost: 5 } } })
export default class BasicSalvager extends Trait {

}