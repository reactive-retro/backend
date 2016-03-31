
import test from 'ava';

import { loadDataFile } from './_helpers';

let armorData = null;
let weaponData = null;
let prefixData = null;
let suffixData = null;
let attributeData = null;
let consumableData = null;
let zoneData = null;
let materialData = null;

test.serial('Armor data is valid hjson', t => {
    armorData = loadDataFile('armor');
    t.pass();
});

test.serial('Weapon data is valid hjson', t => {
    weaponData = loadDataFile('weapon');
    t.pass();
});

test.serial('Attribute data is valid hjson', t => {
    attributeData = loadDataFile('attribute');
    t.pass();
});

test.serial('Prefix data is valid hjson', t => {
    prefixData = loadDataFile('prefix');
    t.pass();
});

test.serial('Suffix data is valid hjson', t => {
    suffixData = loadDataFile('suffix');
    t.pass();
});

test.serial('Consumable data is valid hjson', t => {
    consumableData = loadDataFile('consumable');
    t.pass();
});

test.serial('Zone data is valid hjson', t => {
    zoneData = loadDataFile('zone');
    t.pass();
});

test.serial('Material data is valid hjson', t => {
    materialData = loadDataFile('material');
    t.pass();
});

const validateEffect = (t, effect) => {
    t.ok(effect.name);
    t.ok(effect.statBuff || effect.duration);
};

const validateConsumable = (t, item) => {
    t.ok(item.name);
    t.ok(item.description);
    t.ok(item.weight);

    t.true(item.value > 0);
    t.true(item.minLevel > 0 && item.minLevel <= 50);
    t.true(item.dropRate > 0 && item.dropRate <= 100);
    t.true(item.effects.length > 0);
    item.effects.forEach(effect => validateEffect(t, effect));
};

const validateItem = (t, item) => {
    t.ok(item.name);
    t.ok(item.weight);

    if(item.qualityMod) {
        t.true(item.qualityMod > -1 && item.qualityMod < 3, 'Quality modifiers cannot be too absurd.');
    }

    t.true(item.dropRate > 0 && item.dropRate <= 100);
    t.true(item.minLevel > 0 && item.minLevel <= 50);
    t.true(item.baseQuality > -1 && item.baseQuality < 5);

    const keys = Object.keys(item.stats);
    t.true(keys.length > 0);
};

const validateAttribute = (t, attr) => {
    t.ok(attr.name);
    t.ok(attr.weight);
    t.true(attr.minLevel > 0 && attr.minLevel <= 50);
    t.true(attr.levelMod > -5 && attr.levelMod <= 5, 'Level adjustment cannot be greater than 5.');

    t.notOk(attr.qualityMod, 'Attributes cannot have quality modifiers.');

    const keys = Object.keys(attr.stats);
    t.true(keys.length > 0);

    if(attr.levelMod) {
        t.ok(attr.levelMod);
    }
};

const validateZone = (t, attr) => {
    t.ok(attr.name);
};

const validateMaterial = (t, material) => {
    t.ok(material.name);
    t.true(material.baseQuality >= 0);
    t.true(material.dropRate > 0 && material.dropRate <= 100);
    t.true(material.value > 0);
    t.ok(material.weight);
};

test('Armor data has valid attribute values', t => {
    armorData.forEach(armor => validateItem(t, armor));
    t.pass();
});

test('Weapon data has valid attribute values', t => {
    weaponData.forEach(weapon => validateItem(t, weapon));
    t.pass();
});

test('Prefix data has valid attribute values', t => {
    prefixData.forEach(prefix => validateAttribute(t, prefix));
    t.pass();
});

test('Suffix data has valid attribute values', t => {
    suffixData.forEach(suffix => validateAttribute(t, suffix));
    t.pass();
});

test('Attribute data has valid attribute values', t => {
    attributeData.forEach(attr => validateAttribute(t, attr));
    t.pass();
});

test('Consumable data has valid attribute values', t => {
    consumableData.forEach(item => validateConsumable(t, item));
    t.pass();
});

test('Zone data has valid attribute values', t => {
    zoneData.forEach(attr => validateZone(t, attr));
    t.pass();
});

test('Material data has valid attribute values', t => {
    materialData.forEach(material => validateMaterial(t, material));
    t.pass();
});