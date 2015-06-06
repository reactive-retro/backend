'use strict';

module.exports.run = function(worker) {
    var scServer = worker.scServer;

    scServer.on('connection', function(socket) {
        require('./src/functions/socket/login')(socket);
    });
};
