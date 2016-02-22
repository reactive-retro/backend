
import _ from 'lodash';
import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGOLAB_URI;

const connectionPromise = new Promise((resolve, reject) => {

    MongoClient.connect(connectionString, (err, db) => {

        if(err) {
            console.error(err);
            return reject(err);
        }

        db.collection('players').createIndex({name: 1}, {unique: true}, _.noop);
        db.collection('players').updateMany({}, {$set: {battleId: null}}, _.noop);
        db.collection('battles').deleteMany({}, _.noop);

        resolve(db);
    });
});

export default () => connectionPromise;