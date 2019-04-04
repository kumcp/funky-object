const updateObject = function(oldObj, propertyList) {
    for (key in propertyList) {
        oldObj[key] = propertyList[key];
    }
};

const updateProperty = function(oldObj, propertyName, value) {
    oldObj[propertyName] = value;
};

const filter = function(obj, logicFunc, autoDecode = false) {
    const newObj = {};

    return (function() {
        for (const key in obj) {
            if (logicFunc(key, obj[key])) {
                if (autoDecode && typeof obj[key] === 'string') {
                    newObj[key] = decodeURI(obj[key]);
                } else {
                    newObj[key] = obj[key];
                }
            }
        }
        return newObj;
    })();
};

const filterList = function(objList, logicFunc, autoDecode = false) {
    return objList
        .map(function(obj) {
            if (logicFunc(obj)) {
                return obj;
            } else {
                return undefined;
            }
        })
        .filter(function(item) {
            return item != null;
        });
};

const filterByKeys = function(obj, keyList, autoDecode = false) {
    return filter(
        obj,
        function(key, val) {
            return keyList.indexOf(key) > -1;
        },
        autoDecode
    );
};

const filterListByKeys = function(objList, keyList, autoDecode = false) {
    return objList.map(function(obj) {
        return filterByKeys(obj, keyList);
    });
};
const replateArray = function(obj, characterList, newCharacterList) {
    if (!obj) {
        return '';
    }
    for (let i = 0; i < characterList.length; i++) {
        obj = obj.replace(new RegExp(characterList[i], 'gi'), newCharacterList[i]);
    }
    return obj;
};

// Turn a list object into a compact list object if value in object is the same
// [{a:1},{a:2},{a:1},{b:2},{a:2}]
// -> [{number: [1,3], meta: {a:1}}, {number:[2,5], meta: {a:2}},{number:[3], meta: {b:2}}]

const grepList = function(listObj, logicCheck, logicAdd) {
    const result = [];
    listObj.forEach((element, index) => {

        let grepped = false;
        (function (cb) {
            result.forEach(function (elemResult) {
                if (logicCheck(elemResult.meta, element)) {
                    elemResult.number.push(index)
                    grepped = true
                }
            })
            cb()
        })(function () {
            if (!grepped) {
                result.push({
                    number: [index],
                    meta: element
                })
            }
        })
    });

    return result.map((elem) => {
        return logicAdd(elem)
    });
};

const swapKeyValue = function(obj) {
    const result = {};
    for (const key in obj) {
        result[obj[key]] = key;
    }
    return result;
};

/**
 * Edit each value in object with key
 *
 * @param {*} object object to edit
 * @param {*} manipulateFunc function for create new object
 *  ```
 *  function (key, value){
 *  // ...
 *  return newValue
 *  }
 * ```
 *
 * @returns return new object edited from old object
 */

const editValue = function(object, manipulateFunc) {
    return Object.keys(object).reduce((prev, key) => {
        prev[key] = manipulateFunc(key, object[key]);
        return prev;
    }, {});
};

/**
 * get key by value in array
 * @param {*} object
 * @param {*} value
 * @return key follow value
 */
const getKeyByValue = function(object, value) {
    return Object.keys(object).find(key => object[key] === value);
};

module.exports = {
    updateObject,
    updateProperty,
    filter,
    filterList,
    filterByKeys,
    filterListByKeys,
    grepList,
    swapKeyValue,
    editValue,
    replateArray,
    getKeyByValue
};
