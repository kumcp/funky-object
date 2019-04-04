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
    object[func.name] = function(...args) {
        return func(this, ...args);
    };
    return object;
};

/**
 * Decorate function with list of functions has format:
 * (obj, ...args) => {} can be attached into object
 *
 * @param {*} object
 * @param {*} mappingFunctionList
 */
const decorFunction = (object, mappingFunctionList = {}) => {
    return Object.keys(mappingFunctionList).reduce((prevObj, funcName) => {
        return wrappedObject(prevObj, mappingFunctionList[funcName]);
    }, object);
};

module.exports = {
    wrappedObject,
    decorFunction
};
