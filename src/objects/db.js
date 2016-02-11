
import _ from 'lodash';
import q from 'q';
import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGOLAB_URI;
const dbLoaded = q.defer();

MongoClient.connect(connectionString, (err, db) => {

    if(err) {
        console.error(err);
        dbLoaded.reject(err);
        return;
    }

    db.collection('players').createIndex({name: 1}, {unique: true}, _.noop);
    db.collection('players').updateMany({}, {$set: {battleId: null}}, _.noop);
    db.collection('battles').deleteMany({}, _.noop);

    dbLoaded.resolve(db);
});

export default () => dbLoaded.promise;