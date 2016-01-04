
const _ = require('lodash');
const q = require('q');
const MongoClient = require('mongodb').MongoClient;

const connectionString = process.env.MONGOLAB_URI;
const dbLoaded = q.defer();

MongoClient.connect(connectionString, (err, db) => {

    if(err) {
        console.error(err);
        dbLoaded.reject(err);
        return;
    }

    db.collection('players').createIndex({name: 1}, {unique: true}, _.noop);

    dbLoaded.resolve(db);
});

export default () => dbLoaded.promise;