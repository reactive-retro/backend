
import Trait from '../../base/Trait';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Shadow Stepper I')
@classes({ Ninja: 20 })
@description('All of your damage attacks have a chance to preserve stealth. This effect does not stack with other levels of Shadow Stepper.')
@family('Damage')
@effect('Stealth+', { effectDisplay: '25% of preserving Stealth', attachTo: 'Damage', attachAttr: { spareEffect: 'Stealth', spareChance: 25 } })
export default class BasicShadowStepper extends Trait {

}