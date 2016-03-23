
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Lasting Heals')
@classes({ Cleric: 17 })
@description('Your healing spells leave a lasting regenerative effect.')
@family(ActionTypes.HEAL)
@effect('Regenerate', { effect: { chance: 100, duration: 3 } })
export default class LastingHeals extends Trait {

}