
import Trait from '../../base/Trait';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Mug')
@classes({ Ninja: 15 })
@description('Your Steal skill becomes more potent. It now deals damage, steals gold on contact, steals HP, and steals beneficial effects set upon the enemy.')
@family('Steal')
@effect('Steal', { cooldown: { boost: 3 } })
@effect('Steal+Health', { effectDisplay: 'Steal 5% of foes HP', effect: { ignoreCreation: true } })
@effect('Steal+Gold', { effectDisplay: 'Steal gold', effect: { ignoreCreation: true } })
@effect('Steal+Buff', { effectDisplay: 'Steal a buff', effect: { ignoreCreation: true } })
@effect('Damage', { effectDisplay: 'Deals damage', effect: { roll: '1df([str] / 5) + f([str] / 10)', chance: 100 } })
export default class Mug extends Trait {

}