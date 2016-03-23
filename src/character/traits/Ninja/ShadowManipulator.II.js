
import Trait from '../../base/Trait';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Shadow Manipulator II')
@classes({ Ninja: 45 })
@description('All of your attacks do more damage while stealthed. This effect does not stack with other levels of Shadow Manipulator.')
@family('Damage')
@effect('Stealth Damage+', { effectDisplay: '50% more damage', attachTo: 'Damage', attachAttr: { bonusEffect: 'Stealth', bonusMultiplier: 1.5 } })
export default class BasicShadowManipulator extends Trait {

}