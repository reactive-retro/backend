
import Trait from '../../base/Trait';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('True Nature')
@classes({ Thief: 17 })
@description('You steal more items at a higher success rate.')
@family('Steal')
@effect('Steal+Item', { displayName: 'Steal+', damage: { boost: 1 }, hitchance: { boost: 25 } })
export default class TrueNature extends Trait {

}