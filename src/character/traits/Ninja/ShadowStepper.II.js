
import Trait from '../../base/Trait';
import { name, classes, description, family, effect } from '../../../static/decorators/trait';

@name('Shadow Stepper II')
@classes({ Ninja: 35 })
@description('All of your damage attacks have a chance to preserve stealth. This effect does not stack with other levels of Shadow Stepper.')
@family('Damage')
@effect('Stealth+', { effectDisplay: '50% of preserving Stealth', attachTo: 'Damage', attachAttr: { spareEffect: 'Stealth', spareChance: 50 } })
export default class ShadowStepper extends Trait {

}