/* eslint-disable no-param-reassign */
const ReturnType = {
    MODIFY_PARAM: 0,
    SHALLOW_COPY: 1
};

const ConflictHanlde = {
    OVERWRITE: 0,
    KEEP: 1,
    MAKE_LIST: 2,
    CUSTOM: -1
};

const defaultOptions = {
    returnType: ReturnType.SHALLOW_COPY,
    conflictHandle: ConflictHanlde.OVERWRITE
};

/**
 * Update object with another object
 * Ex:
 * ```
 * updateObject({ a: 1, b: 2}, {b: 3, c: 5})
 * // => { a: 1, b: 3, c:5 }
 * ```
 *
 * @param {{}} oldObj object need to update info
 * @param {{}} propertyList param and value need to update
 * @param {{returnType: ReturnType}} inputOptions option for modification:
 *
 * `ReturnType.MODIFY_PARAM` will modify directly parsing object
 * `ReturnType.SHALLOW_COPY` (Default) will create a shallow copy of old object
 *
 * @returns {{}} Updated object
 */
const updateObject = (oldObj, propertyList, inputOptions = {}) => {
    const options = {
        ...defaultOptions,
        ...inputOptions
    };

    // options.returnType === ReturnType.SHALLOW_COPY (default)
    let newObj = { ...oldObj };

    if (options.returnType === ReturnType.MODIFY_PARAM) {
        newObj = oldObj;
    }

    return Object.keys(propertyList).reduce((prevObj, modifyKey) => {
        prevObj[modifyKey] = propertyList[modifyKey];
        return prevObj;
    }, newObj);
};

/**
 * Swap key and value of an object.
 * NOTE: If value is not unique, then it will be overwritten by default
 *
 * @param {*} obj
 */
const swapKeyValue = (obj, inputOptions) => {
    const options = {
        ...defaultOptions,
        ...inputOptions
    };

    return Object.keys(obj).reduce((prev, key) => {
        if (options.conflictHandle === ConflictHanlde.KEEP) {
            const value = prev[obj[key]] === undefined ? key : prev[obj[key]];
            prev[obj[key]] = value;
            return prev;
        }

        if (options.conflictHandle === ConflictHanlde.MAKE_LIST) {
            const value = prev[obj[key]] === undefined ? key : prev[obj[key]];
            prev[obj[key]] = value;
            return prev;
        }

        if (options.conflictHandle === ConflictHanlde.CUSTOM) {
            if (prev[obj[key]] === undefined) {
                prev[obj[key]] = key;
                return prev;
            }

            if (Array.isArray(prev[obj[key]])) {
                return [...prev[obj[key]], key];
            }

            return [prev[obj[key]], key];
        }

        // options.conflictHandle === ConflictHanlde.OVERWRITE) ++
        prev[obj[key]] = key;
        return prev;
    }, {});
};

/**
 * Edit each value in object with manipulate function
 *
 * Ex:
 * ```
 * editValue({a:1, b:2}, (key, val) => val * 2)
 * => {a: 2, b:4}
 * ```
 * @param {*} object object to edit
 * @param {*} manipulateFunc function for create new object
 *  ```
 *  function (key, value){
 *      // ...
 *      return newValue
 *  }
 * ```
 *
 * @returns return new object edited from old object
 */

const editValue = (object, manipulateFunc = (key, val) => val) =>
    Object.keys(object).reduce((prev, key) => {
        prev[key] = manipulateFunc(key, object[key]);
        return prev;
    }, {});

/**
 * Change key of all properties inside object
 *
 *
 * @param {{}} object
 * @param {(key) => String} func to modify key return a string key
 *
 * @return {{}} new object
 */
const editKey = (object, func) =>
    Object.keys(object).reduce(
        (prev, key) => ({
            ...prev,
            [func(key)]: object[key]
        }),
        {}
    );

/**
 * Merge a list of object using list of modifying by order
 * If the key is same, then take the last one
 *
 * Ex:
 *```
 * mergeObject([{a: 1, b:2}, {x:3, y:4}])
 * => {a:1, b:2, c:3, d:4}
 *
 * mergeObject([{a: 1, b:2}, {x:3, y:4}],
 *              [obj => editKey(obj, key => `old.${key}`),
 *               obj => editKey(obj, key => `new.${key}`)])
 * => {"old.a": 1, "old.b": 2, "new.x": 3, "new.y": 4}
 * ```
 *
 * @param {*} objList
 * @param {*} modifyingList
 */
const mergeObject = (objList, modifyingList = []) => {
    const defaultMoodifying = o => o;
    return objList.reduce(
        (prev, curr, index) => ({
            ...prev,
            ...(modifyingList[index] || defaultMoodifying)(curr)
        }),
        {}
    );
};

/**
 * Get key by value in array, return the first key that match the value
 *
 * @param {*} object
 * @param {*} value
 *
 * @return key follow value
 */
const getKeyByValue = (object, value) =>
    Object.keys(object).find(key => object[key] === value);

module.exports = {
    updateObject,
    updateProperty,
    swapKeyValue,
    editValue,
    editKey,
    mergeObject,
    getKeyByValue
};
