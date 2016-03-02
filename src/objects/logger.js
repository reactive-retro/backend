
import rollbar from 'rollbar';

let usingRollbar = false;

if(process.env.ROLLBAR_ACCESS_TOKEN) {
    usingRollbar = true;
    rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN);
}

export default class Logger {

    static _formatMessage(tag, message) {
        return `[${new Date()}] {${tag}} ${message}`;
    }

    static error(tag, error) {
        console.error(this._formatMessage(tag, error.message));
        if(usingRollbar) {

        }
    }
}