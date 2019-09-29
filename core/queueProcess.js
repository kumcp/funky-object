// Default value
const LOOPING_TIME_IN_MS = 5000;
const MAX_REQUESTS_DEFAULT = 50;

const QueueRequest = {
    maxRequestNum: MAX_REQUESTS_DEFAULT,
    loopTimeDelayInMs: LOOPING_TIME_IN_MS,
    itemRequest: [],
    /**
     * Start infinity loop queue with Time delay for each process
     *
     * @param {number} timeDelay time delay for each process. Default is 1000ms
     */
    startQueueDelay(timeDelay = 1000) {
        let lockGate = false;
        let requestIndex = 0;

        this.queueDelayId = setInterval(async () => {
            if (this.itemRequest.length <= 0 || lockGate) {
                return;
            }

            const firstRequest = this.itemRequest.shift();
            console.log(this.itemRequest);
            lockGate = true;

            console.time(`Process time for item ${requestIndex}`);
            await firstRequest();
            console.timeEnd(`Process time for item ${requestIndex}`);

            requestIndex += 1;

            lockGate = false;
        }, timeDelay);
    },
    /**
     * Start process queue one by one until the last process then stop
     */
    async startQueue() {
        let lockGate = false;
        let requestIndex = 0;

        while (!(this.itemRequest.length <= 0 || lockGate)) {
            const firstRequest = this.itemRequest.shift();
            console.log(this.itemRequest);
            lockGate = true;

            console.time(`Process time for item ${requestIndex}`);

            // TODO: Need test
            // eslint-disable-next-line no-await-in-loop
            await firstRequest();
            console.timeEnd(`Process time for item ${requestIndex}`);

            requestIndex += 1;
            lockGate = false;
        }
    },
    /**
     * Start process queue one by one until the last process.
     * If the queue is blank, then check queue after a period of time.
     *
     *
     */
    startQueueInfitify() {
        this.queueInfinityId = setInterval(async () => {
            if (this.itemRequest.length <= 0) {
                return;
            }

            await this.startQueue();
        }, this.loopTimeDelayInMs);
    },
    /**
     *
     */
    stopQueueInfinity() {
        clearInterval(this.queueInfinityId);
    },

    /**
     * Generate a request for queue
     *
     * @param {*} params An object contains information to generate request or a function
     * which will be add to queue
     */
    generateRequest(params = {}) {
        if (typeof params === 'function') {
            return params;
        }

        return this.generateRequestFunctor(params);
    },
    /**
     * Abstract function to construct function generateRequest for any specific use case.
     *
     * In this phase, only use queue for reminder process, so write here for hide complicated
     * switch case.
     *
     * @param {*} params An object contains information to generate request or a function
     * which will be add to queue
     *
     * @return {AsyncFunction} Return a AsyncFunction as a process will be execute in queue
     */
    generateRequestFunctor(params = {}) {
        if (!params.type) {
            return async () => {};
        }

        return async () => {};
    },
    /**
     * Generate a request for queue and add to queue
     *
     * @param {*} params An object contains information to generate request or a function
     * which will be add to queue
     */
    addRequest(params) {
        this.addItem(this.generateRequest(params));
    },
    /**
     * Add a request to queue
     *
     * @param {*} item function request to be run in queue
     */
    addItem(item) {
        if (this.itemRequest.length > this.maxRequestNum) {
            throw new Error('MAX_REQUEST_EXCEED');
        }

        this.itemRequest.push(item);
    }
};

/**
 * Generate an instance of QueueRequest
 *
 * @param {Object} options include some kind of parameters:
 * ```{
 * maxRequestNum: Max number request of queue. When add to a full queue, throw an error.
 * loopTimeDelayInMs: time to check queue after a period of time
 * }```
 *
 * @return {QueueRequest} Return a QueueRequest
 */
const generateQueueRequest = (options = {}) => ({
    ...Object.create(QueueRequest),
    maxRequestNum: options.maxRequestNum || MAX_REQUESTS_DEFAULT,
    loopTimeDelayInMs: options.loopTimeDelayInMs || LOOPING_TIME_IN_MS
});

module.exports = {
    QueueRequest,
    generateQueueRequest
};
