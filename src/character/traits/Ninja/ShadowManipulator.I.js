
import Trait from '../../base/Trait';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Shadow Manipulator I')
@classes({ Ninja: 25 })
@description('All of your attacks do more damage while stealthed. This effect does not stack with other levels of Shadow Manipulator.')
@family('Damage')
@effect('Stealth Damage+', { effectDisplay: '25% more damage', attachTo: 'Damage', attachAttr: { bonusEffect: 'Stealth', bonusMultiplier: 1.25 } })
export default class BasicShadowManipulator extends Trait {

}