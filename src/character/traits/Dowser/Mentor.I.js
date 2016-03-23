
import Trait from '../../base/Trait';
import { ActionTypes } from '../../base/Action';
import { name, classes, description, effect, family } from '../../../static/decorators/trait';

@name('Mentor I')
@classes({ Dowser: 15 })
@description('Gain more experience when killing enemies.')
@family(ActionTypes.NONE)
@effect('XP+', { effectDisplay: '+25% xp gained', stats: { xpgain: { boost: 25 } } })
export default class BasicMentor extends Trait {

}