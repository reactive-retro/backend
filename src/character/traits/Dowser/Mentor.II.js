
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Mentor II')
@classes({ Dowser: 50 })
@description('Gain more experience when killing enemies.')
@family(ActionTypes.NONE)
@effect('XP+', { effectDisplay: '+50% xp gained', stats: { xpgain: { boost: 50 } } })
export default class Mentor extends Trait {

}