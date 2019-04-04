const defaultCallbackOptions = {
    type: 0
}

/**
 * Function to transform a Promise style into callback style
 *  - `positionCallback` position number of callback in params list. Default = -1 (last)
 *  - `type`:
 *      `0`: callback with (result, err) => {}    (Default).
 *      `1`: callback with successCb = (result) => {}, errorCb = (error) => {}
 *  - `context`:(Default = this) context of function
 *
 * @param {*} func Function in Promise style
 * @param {*} options
 *
 * @param {Number} [options.positionCallback]
 * @param {Number} [options.type]
 * @param {*} [options.context]
 */
const callbackify = (func, options) => {
    let opt = {
        ...defaultCallbackOptions,
        ...options
    }

    const CallbackifyMap = {
        0: (...args) => {
            let positionOption = opt.positionCallback || args.length - 1
            let [cb] = args.splice(positionOption, 1)

            func(...args)
                .then(result => {
                    cb(result)
                })
                .catch(err => {
                    cb(null, err)
                })
        },
        1: (...args) => {
            let positionOption = opt.positionCallback || args.length - 1
            let [successCb, errorCb] = args.splice(positionOption, 2)

            func(...args)
                .then(result => {
                    successCb(result)
                })
                .catch(err => {
                    errorCb(err)
                })
        }
    }

    return CallbackifyMap[opt.type]
}

const norm = cb => {
    func(...args).then(result => {
        cb(result)
    })
}

module.exports = {
    callbackify
}
