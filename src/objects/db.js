var pmongo = require('promised-mongo');
var connectionString = 'mongodb://127.0.0.1/retro';

var db = pmongo(connectionString, ['players', 'places']);
db.players.createIndex({name: 1}, {unique: true});
db.places.createIndex({coordinates: 1, name: 1}, {unique: true});
db.places.createIndex({coordinates: '2dsphere'});

module.exports = db;