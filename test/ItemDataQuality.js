
import test from 'ava';

import { loadDataFile } from './helpers';

let armorData = null;
let weaponData = null;
let prefixData = null;
let suffixData = null;
let attributeData = null;

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

const validateItem = (t, item) => {
    t.ok(item.name);
    t.ok(item.weight);
    t.ok(item.minLevel);
    t.ok(item.dropRate);

    t.true(item.dropRate > 0 && item.dropRate <= 100);
    t.true(item.minLevel > 0 && item.minLevel < 100);
    t.true(item.baseQuality > -1 && item.baseQuality < 5);

    const keys = Object.keys(item.stats);
    t.true(keys.length > 0);
};

const validateAttribute = (t, attr) => {
    t.ok(attr.name);
    t.ok(attr.weight);
    t.ok(attr.minLevel);

    const keys = Object.keys(attr.stats);
    t.true(keys.length > 0);

    if(attr.levelMod) {
        t.ok(attr.levelMod);
    }
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