
export default class Logger {

    static _formatMessage(tag, message) {
        return `[${new Date()}] {${tag}} ${message}`;
    }

    static error(tag, message) {
        console.error(this._formatMessage(tag, message));
    }
}