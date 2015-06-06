var pmongo = require('promised-mongo');
var connectionString = 'mongodb://127.0.0.1/retro';

var db = pmongo(connectionString, ['players']);
db.players.createIndex({name: 1}, {unique: true});

module.exports = db;