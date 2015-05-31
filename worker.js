var pmongo = require('promised-mongo');
var connectionString = 'mongodb://127.0.0.1/retro';

module.exports.run = (worker) => {
    var scServer = worker.scServer;

    var db = pmongo(connectionString, ['players']);
    db.players.createIndex({name: 1}, {unique: true});

    scServer.on('connection', (socket) => {
        require('./functions/login')(socket, db);
    });
};
