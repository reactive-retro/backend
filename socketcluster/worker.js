
import _ from 'lodash';
import path from 'path';
import fs from 'fs';

export var run = (worker) => {
    const scServer = worker.scServer;

    scServer.on('connection', socket => {

        const normalizedPath = path.join(__dirname, '..', 'src', 'functions', 'socket');

        _.each(fs.readdirSync(normalizedPath), file => {
            console.log(file);
            require(`../src/functions/socket/${file}`)(socket);
        });
    });
};