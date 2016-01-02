'use strict';

var _ = require('lodash');

module.exports.run = function(worker) {
    var scServer = worker.scServer;

    scServer.on('connection', function(socket) {

        var normalizedPath = require('path').join(__dirname, 'src', 'functions', 'socket');

        _.each(require('fs').readdirSync(normalizedPath), function(file) {
            require('./src/functions/socket/'+file)(socket);
        });
    });
};
