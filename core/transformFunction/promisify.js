/**
 * This function is for transform a callback into a promise.
 *
 * option can be:
 * - `positionCallback` position number of callback in params list. Default = -1 (last)
 * - `type`:
 *      `0`: callback with (result, err) => {}    (Default).
 *      `1`: callback with (arg1, arg2, arg3) => {}.
 *      `2`: callback with successCb = (result) => {}, errorCb = (error) => {}
 * - `context`:(Default = this) context of function
 *
 * @param {function} func Function in callback style
 * @param {Object} options:
 *
 *
 * @param {Number} [options.positionCallback]
 * @param {Number} [options.type]
 * @param {*} [options.context]
 * @return {function} Function in Promise style
 */
const promisify = (func, options = {}) => {
    let positionOption = options.positionCallback
    if (!options.type) options.type = 0

    if (!options.context) options.context = this

    const promiseTypeMap = {
        0: (...params) => {
            const position = positionOption || params.length

            return new Promise((resolve, reject) => {
                const callback = (result, err) => {
                    return err ? reject(err) : resolve(result)
                }

                let result = func.apply(options.context, [
                    ...params.slice(0, position),
                    callback,
                    ...params.slice(position, params.length)
                ])
                if (result) {
                    resolve(result)
                }
            })
        },
        1: (...params) => {
            const position = positionOption || params.length

            return new Promise(resolve => {
                // For multiple callback, Promise (Default) only receive 1 parameter as result, so
                // using array result instead

                const callback = (...result) => resolve(result)

                func.apply(options.context, [
                    ...params.slice(0, position),
                    callback,
                    ...params.slice(position, params.length)
                ])
            })
        },
        2: (...params) => {
            const position = positionOption || params.length

            return new Promise((resolve, reject) => {
                const successCallback = (...result) => {
                    return resolve(result)
                }

                const errorCallback = (...err) => {
                    return reject(err)
                }

                func.apply(options.context, [
                    ...params.slice(0, position),
                    successCallback,
                    errorCallback,
                    ...params.slice(position, params.length)
                ])
            })
        }
    }

    const normalFunc = (...params) => {
        return func.apply(this, [...params])
    }

    return promiseTypeMap[options.type] || normalFunc
}

function a() {}

const addSupportPromise = (func, options = {}) => {}

module.exports = {
    promisify
}
