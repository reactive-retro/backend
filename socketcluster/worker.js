
import _ from 'lodash';
import path from 'path';
import fs from 'fs';

export var run = (worker) => {
    const scServer = worker.scServer;

    scServer.on('connection', socket => {

        socket.on('error', e => {
            console.error(e.message);
        });

        const normalizedPath = path.join(__dirname, '..', 'src', 'functions', 'socket');

        _.each(fs.readdirSync(normalizedPath), file => {
            require(`../src/functions/socket/${file}`).default(socket);
        });
    });
};