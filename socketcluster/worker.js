
import _ from 'lodash';

export var run = (worker) => {
    const scServer = worker.scServer;

    scServer.on('connection', (socket) => {

        const normalizedPath = require('path').join(__dirname, 'src', 'functions', 'socket');

        _.each(require('fs').readdirSync(normalizedPath), (file) => {
            require('./src/functions/socket/'+file)(socket);
        });
    });
};
