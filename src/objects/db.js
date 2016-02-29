
import _ from 'lodash';
import hjson from 'hjson';
import path from 'path';
import { readFileSync } from 'fs';
import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGOLAB_URI;

const monsterHjson = hjson.parse(readFileSync(path.join(__dirname, '..', '..', 'data', 'monsters.hjson'), 'utf8'));

const connectionPromise = new Promise((resolve, reject) => {

    MongoClient.connect(connectionString, (err, db) => {

        if(err) {
            console.error(err);
            return reject(err);
        }

        db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
        db.collection('players').updateMany({}, { $set: { battleId: null } }, _.noop);
        db.collection('battles').deleteMany({}, _.noop);
        db.collection('homepointPlaces').createIndex({ location: 1 }, _.noop);
        db.collection('monsters').deleteMany({}, () => {
            db.collection('monsters').insertMany(monsterHjson, _.noop);
        });

        resolve(db);
    });
});

export default () => connectionPromise;