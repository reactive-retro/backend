'use strict';

module.exports.run = function(worker) {
    var scServer = worker.scServer;

    scServer.on('connection', function(socket) {
        require('./src/functions/socket/login')(socket);
        require('./src/functions/socket/changeclass')(socket);
        require('./src/functions/socket/equip')(socket);
    });
};
