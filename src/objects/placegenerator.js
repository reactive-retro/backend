
import _ from 'lodash';
import crypto from 'crypto';

import SETTINGS from '../static/settings';
import ItemGenerator from '../objects/itemgenerator';

import nearbyMonsters from '../functions/world/nearbymonsters';

import { singleChoice } from '../functions/helpers';

const serverSalt = crypto.createHash('md5').update(''+Math.random()).digest('hex');

const TYPES = {
    ITEM_SHOP: 'Item Store',
    WEAPON_SHOP: 'Weapon Store',
    ARMOR_SHOP: 'Armor Store',
    MIXED_SHOP: 'General Store',
    TREASURE_CHEST: 'Treasure Chest',
    DUNGEON_CHEST: 'Dungeon Chest'
};

const TYPE_MAP = {
    [TYPES.ITEM_SHOP]: [
        'liquor_store', 'bar', 'bicycle_store', 'meal_delivery', 'meal_takeaway', 'book_store',
        'cafe', 'pet_store', 'pharmacy', 'restaurant', 'florist', 'food'],
    [TYPES.WEAPON_SHOP]: [
        'hardware_store', 'electronics_store', 'furniture_store'],
    [TYPES.ARMOR_SHOP]: [
        'clothing_store', 'shoe_store', 'jewelry_store'],
    [TYPES.MIXED_SHOP]: [
        'convenience_store', 'department_store', 'store', 'gas_station',
        'grocery_or_supermarket', 'home_goods_store', 'shopping_mall'],
    [TYPES.DUNGEON_CHEST]: [
        'hospital', 'amusement_park', 'art_gallery', 'library', 'local_government_office', 'bank',
        'mosque', 'museum', 'night_club', 'park', 'cemetery', 'city_hall', 'embassy', 'school',
        'stadium', 'hindu_temple', 'university', 'zoo', 'synagogue', 'place_of_worship', 'church'
    ],
    [TYPES.TREASURE_CHEST]: []
};

const getPlaceType = (place) => {
    const typeMatches = (type) => _.intersection(place.types, TYPE_MAP[type]).length > 0;

    // if(typeMatches(TYPES.ITEM_SHOP)) return TYPES.ITEM_SHOP;
    if(typeMatches(TYPES.WEAPON_SHOP)) return TYPES.WEAPON_SHOP;
    if(typeMatches(TYPES.ARMOR_SHOP)) return TYPES.ARMOR_SHOP;
    if(typeMatches(TYPES.MIXED_SHOP)) return TYPES.MIXED_SHOP;

    if(typeMatches(TYPES.DUNGEON_CHEST)) return TYPES.DUNGEON_CHEST;

    return TYPES.TREASURE_CHEST;
};

// seed places based on the day
export const getSeed = () => {
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);
    now.setHours(0);

    return now.getTime();
};

const getItemType = (placeType) => {
    switch(placeType) {
        case TYPES.WEAPON_SHOP: return 'weapon';
        case TYPES.ARMOR_SHOP: return 'armor';
        default: return '';
    }
};

const getItemCountForPlace = (placeType) => {
    switch(placeType) {
        case TYPES.WEAPON_SHOP:
        case TYPES.ARMOR_SHOP: return 3;

        case TYPES.DUNGEON_CHEST: return 3;
        default: return 1;
    }
};

const getItemGenOpts = ({ placeType, ratingOffset }) => {
    const maxRating = SETTINGS.MONSTER_GENERATION.DUNGEON.levelOffset.max;

    switch(placeType) {
        case TYPES.DUNGEON_CHEST: return { minQuality: ratingOffset < maxRating - 1 ? 1 : 2 };
        default: return {};
    }
};

const getRequirements = ({ location, derivedType, seed, ratingOffset }, playerReference) => {
    const monsterSettings = SETTINGS.MONSTER_GENERATION.DUNGEON;

    const args = _.extend(
        _.cloneDeep(monsterSettings),
        { playerLevel: playerReference.currentLevel, ratingOffset },
        { lat: location.lat, lon: location.lng },
        { seed }
    );

    switch(derivedType) {
        case TYPES.DUNGEON_CHEST: return nearbyMonsters(args);
        default: return [];
    }
};

const getContents = ({ derivedType, seed, ratingOffset }, playerReference) => {

    const contents = [];
    const maxItems = getItemCountForPlace(derivedType);
    const itemType = getItemType(derivedType);
    const itemOpts = getItemGenOpts({ derivedType, ratingOffset });

    const genSeed = seed + JSON.stringify(playerReference.homepoint);

    const baseOpts = _.extend({ playerReference, type: itemType }, itemOpts);

    for(let i = 0; i < maxItems; i++) {
        baseOpts.seed = genSeed + i;
        const item = ItemGenerator.generate(baseOpts);
        contents.push(item);
    }

    return contents;
};

export default async (baseOpts, playerReference) => {
    const place = _.clone(baseOpts);

    return new Promise(async resolve => {

        place.seed = getSeed() + place.place_id;
        place.derivedType = getPlaceType(place);
        place.location = baseOpts.geometry.location;

        const { min, max } = SETTINGS.MONSTER_GENERATION.DUNGEON.levelOffset;
        place.ratingOffset = singleChoice(_.range(min, max), place.seed);

        place.contents = await Promise.all(getContents(place, playerReference));
        const requirements = await getRequirements(place, playerReference);

        _.each(requirements, r => r.isDungeon = true);
        place.requirements = _.map(requirements, 'id');
        place.fullRequirements = requirements;
        place.verifyToken = generate(place, playerReference);

        resolve(_.pick(place, ['name', 'requirements', 'fullRequirements', 'location', 'contents', 'derivedType', 'seed', 'verifyToken']));
    });
};

export const generate = (place) => {
    const props = _.pick(place, ['name', 'requirements', 'location', 'contents', 'derivedType', 'seed']);
    return crypto.createHash('md5').update(serverSalt + JSON.stringify(props)).digest('hex');
};

export const verify = (place) => {
    const testToken = generate(place);
    return testToken === place.verifyToken;
};