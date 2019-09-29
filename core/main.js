const { callbackify } = require('./transformFunction/callbackify');
const { promisify } = require('./transformFunction/promisify');

const QueueProcess = require('./queueProcess');

const ObjectTransform = require('./transformObject/objectTransform');

module.exports = {
    Function: {
        callbackify,
        promisify
    },
    List: {},
    ObjectTransform,
    Crypto: {},
    CSV: {},
    QueueProcess
};
