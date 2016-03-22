
import test from 'ava';

import { allTraits } from '../../src/objects/traitmanager';

const allProfessions = require('require-dir')('../../src/character/professions');

const validateTraitBoostMultObj = (t, checkObj) => {
    t.notOk(checkObj.boost && checkObj.multiplier);

    t.ok(checkObj.boost || checkObj.multiplier);
};

allTraits.forEach(trait => {
    test(`${trait.traitName} trait data is valid`, t => {

        t.ok(trait.traitName);
        t.ok(trait.traitDescription);
        t.ok(trait.traitFamily);

        const usedProfessions = Object.keys(trait.traitClasses);
        t.true(usedProfessions.length > 0);
        usedProfessions.forEach(prof => {
            t.true(!!allProfessions[prof]);
            t.true(trait.traitClasses[prof] > 0);
        });

        t.true(Object.keys(trait.traitEffects).length > 0);

        Object.keys(trait.traitEffects).forEach(traitKey => {
            const traitEffect = trait.traitEffects[traitKey];

            t.ok(traitEffect.effect || traitEffect.damage || traitEffect.hitchance || traitEffect.cooldown || traitEffect.duration || traitEffect.cost || traitEffect.stats || traitEffect.effectDisplay);

            if(traitEffect.effect) {
                t.true(traitEffect.effect.chance > 0 && traitEffect.effect.chance <= 100);
                t.true(traitEffect.effect.duration > 0);
            }

            if(traitEffect.effectDisplay) t.true(traitEffect.effectDisplay.length > 0);

            ['damage', 'hitchance', 'cooldown', 'duration', 'cost'].forEach(key => {
                if(!traitEffect[key]) return;
                validateTraitBoostMultObj(t, traitEffect[key]);
            });

            if(traitEffect.stats) {
                t.ok(traitEffect.stats.str || traitEffect.stats.dex || traitEffect.stats.mnt || traitEffect.stats.luk || traitEffect.stats.vit || traitEffect.stats.acc);

                ['str', 'dex', 'mnt', 'luk', 'vit', 'acc'].forEach(key => {
                    if(!traitEffect.stats[key]) return;
                    validateTraitBoostMultObj(t, traitEffect.stats[key]);
                });
            }
        });
    });
});
