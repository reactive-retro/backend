
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Extended Support')
@classes({ Cleric: 34 })
@description('Your support buffs last longer.')
@family(ActionTypes.BUFF)
@effect('Buff+', { duration: { boost: 3 } })
export default class ExtendedSupport extends Trait {

}