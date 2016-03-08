
import _ from 'lodash';
import crypto from 'crypto';

import ItemGenerator from '../objects/itemgenerator';

const serverSalt = crypto.createHash('md5').update(''+Math.random()).digest('hex');

const TYPES = {
    ITEM_SHOP: 'Item Shop',
    WEAPON_SHOP: 'Weapon Shop',
    ARMOR_SHOP: 'Armor Shop',
    MIXED_SHOP: 'General Store',
    TREASURE_CHEST: 'Treasure Chest'
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
    [TYPES.TREASURE_CHEST]: []
};

const getPlaceType = (place) => {
    const typeMatches = (type) => _.intersection(place.types, TYPE_MAP[type]).length > 0;

    // if(typeMatches(TYPES.ITEM_SHOP)) return TYPES.ITEM_SHOP;
    if(typeMatches(TYPES.WEAPON_SHOP)) return TYPES.WEAPON_SHOP;
    if(typeMatches(TYPES.ARMOR_SHOP)) return TYPES.ARMOR_SHOP;
    if(typeMatches(TYPES.MIXED_SHOP)) return TYPES.MIXED_SHOP;

    return TYPES.TREASURE_CHEST;
};

// seed places based on the day
const getSeed = () => {
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

const getContents = (placeType, seed, playerReference) => {

    const contents = [];
    const maxItems = placeType === TYPES.TREASURE_CHEST ? 1 : 3;
    const itemType = getItemType(placeType);

    for(let i = 0; i < maxItems; i++) {
        const item = ItemGenerator.generate(playerReference, itemType, seed+i);
        contents.push(item);
    }

    return contents;
};

export default async (baseOpts, genOpts) => {
    const place = _.clone(baseOpts);

    return new Promise(async resolve => {

        place.seed = getSeed() + place.place_id;
        place.verifyToken = generate(place);
        place.derivedType = getPlaceType(place);
        place.location = baseOpts.geometry.location;
        place.contents = await Promise.all(getContents(place.derivedType, place.seed, genOpts));

        resolve(_.pick(place, ['name', 'location', 'contents', 'derivedType', 'rating', 'seed', 'verifyToken']));
    });
};

export const generate = (place) => {
    const props = _.pick(place, ['name', 'location', 'contents', 'derivedType', 'rating', 'seed']);
    return crypto.createHash('md5').update(serverSalt + JSON.stringify(props)).digest('hex');
};

export const verify = (place) => {
    const testToken = generate(place);
    return testToken === place.verifyToken;
};