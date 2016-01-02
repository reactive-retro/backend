var connectionString = process.env.MONGOLAB_URI;

var _ = require('lodash');
var q = require('q');
var MongoClient = require('mongodb').MongoClient;

var dbLoaded = q.defer();

MongoClient.connect(connectionString, function(err, db) {

    if(err) {
        console.error(err);
        dbLoaded.reject(err);
        return;
    }

    db.collection('players').createIndex({name: 1}, {unique: true}, _.noop);

    dbLoaded.resolve(db);
});

module.exports = function() {
    return dbLoaded.promise;
};