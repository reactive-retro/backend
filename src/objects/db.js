
import _ from 'lodash';
import hjson from 'hjson';
import path from 'path';
import { readFileSync } from 'fs';
import { MongoClient } from 'mongodb';

import Logger from '../objects/logger';
import ItemGenerator from './itemgenerator';

const connectionString = process.env.MONGOLAB_URI;

const loadHjson = (fileName) => hjson.parse(readFileSync(path.join(__dirname, '..', '..', 'data', `${fileName}.hjson`), 'utf8'));
const formatHjson = (fileName) => {
    const hjson = loadHjson(fileName);
    _.each(hjson, (item, idx) => item._id = idx);
    return hjson;
};

const connectionPromise = new Promise((resolve, reject) => {

    MongoClient.connect(connectionString, async (err, db) => {

        if(err) {
            Logger.error('DB:Init', err);
            return reject(err);
        }

        db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
        db.collection('players').updateMany({}, { $set: { battleId: null, online: false } }, _.noop);

        db.collection('battles').deleteMany({}, _.noop);

        db.collection('parties').deleteMany({}, _.noop);

        db.collection('homepointPlaces').createIndex({ location: 1 }, _.noop);

        const monsters = db.collection('monsters');
        monsters.deleteMany({}, () => {
            monsters.insertMany(loadHjson('monster'), _.noop);
        });

        const itemsLoaded = _.map(['armor', 'attribute', 'material', 'consumable', 'prefix', 'suffix', 'weapon', 'zone'], type => {
            const itemData = db.collection(`item.${type}Data`);
            // itemData.createIndex({ name: 1 }, { unique: true }, _.noop);
            return new Promise((resolve, reject) => {
                itemData.deleteMany({}, () => {
                    itemData.insertMany(formatHjson(type), (err) => {
                        if(err) return reject(err);
                        resolve();
                    });
                });
            });
        });

        await Promise.all(itemsLoaded);

        ItemGenerator.init();

        resolve(db);
    });
});

export default () => connectionPromise;