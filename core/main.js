const { callbackify } = require('./transformFunction/callbackify');
const { promisify } = require('./transformFunction/promisify');

const QueueProcess = require('./queueProcess');

module.exports = {
    Function: {
        callbackify,
        promisify
    },
    List: {},
    Object: {},
    Crypto: {},
    CSV: {},
    QueueProcess
};
