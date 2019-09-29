/**
 * Wrap a function with format: func = (object, ...params) => { ... }
 * and attach it to the object and turn to runable with:
 * object.func(...params). Note that this function will modify
 * the parsing object
 *
 *
 * @param {*} object which need to wrap function
 * @param {*} func function in format: (obj, ...args) => {}
 */
const wrappedObject = (object, func = () => {}) => {
    // eslint-disable-next-line no-param-reassign
    object[func.name] = (...args) => func(this, ...args);
    return object;
};

/**
 * Decorate function with list of functions has format:
 * (obj, ...args) => {} can be attached into object
 *
 * @param {*} object
 * @param {*} mappingFunctionList
 */
const decorFunction = (object, mappingFunctionList = {}) =>
    Object.keys(mappingFunctionList).reduce(
        (prevObj, funcName) =>
            wrappedObject(prevObj, mappingFunctionList[funcName]),
        object
    );

module.exports = {
    wrappedObject,
    decorFunction
};
