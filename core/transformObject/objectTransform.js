/**
 * Filter key value in a object
 * @param {*} object All object
 * @param {*} filter filter function
 */
const objectFilter = (object, filter) => {
    if (!object) throw new Error('OBJECT_NOT_DEFINED');
    if (typeof object !== 'object') throw new Error('NOT_AN_OBJECT');
    if (typeof filter !== 'function') throw new Error('FILTER_IS_NOT_FUNCTION');

    return Object.keys(object)
        .filter((key) => (filter || ((k, v) => v))(key, object[key]))
        .reduce(
            (newObj, key) => ({
                ...newObj,
                [key]: object[key]
            }),
            {}
        );
};
/**
 * Filter object with a list of key (return a new object)
 *
 * @param {*} object contain key-value
 * @param {*} keyList list key want to filter
 */
const objectFilterByKeys = (object, keyList) =>
    objectFilter(object, (key) => keyList.indexOf(key) > -1);

/**
 * Turn list object in hierachy into a flatten list
 *
 * List object in format:
 * ```
 * [{
 *      param1: value1,
 *      list: [
 *          { param1_1: value1_1 },
 *          { param1_2: value1_2 },
 *          { param1_3: value1_3 },
 *      ]
 * },{
 *      param1: value2,
 *      list: [
 *          { param1_1: value2_1 },
 *          { param1_2: value2_2 },
 *          { param1_3: value2_3 },
 *      ]
 * }]
 * // =>
 *  [{param1: value1, param1_1: value1_1},
 * {param1: value1, param1_2: value1_2},
 * {param1: value1, param1_3: value1_3},
 * {param1: value2, param1_1: value2_1},
 * {param1: value2, param1_2: value2_2},
 * {param1: value2, param1_3: value2_3},
 * ]
 *
 * ```
 * @param {*} chilrenObjectList
 *
 *
 * @param {*} childrenField keyField contain an array of object
 *
 * @returns {Array} a list contain both the children object and parent object data
 */
const flattenChildrenObjectList = (chilrenObjectList, childrenField) =>
    chilrenObjectList
        .filter((object) => (!object ? {} : object))
        .reduce((flattenList, object) => {
            if (Array.isArray(object[childrenField])) {
                return flattenList.concat(
                    flattenChildrenObjectList(
                        object[childrenField],
                        childrenField
                    ).map((childObj) => ({
                        ...childObj,
                        ...objectFilter(object, (key) => key !== childrenField)
                    }))
                );
            }

            flattenList.push(
                objectFilter(object, (key) => key !== childrenField)
            );

            return flattenList;
        }, []);

/**
 * Spread nested object with value is object
 * Ex:
 * ```
 * spreadNestedObject({a:1, b: {b1: 11, b2: 12}}, ["b"])
 * // => {a:1, b1:11, b2:12}
 * ```
 * @param {*} object parent object
 * @param {*} fieldList child fields which are object to be exploit
 */
const spreadNestedObject = (object, fieldList) =>
    Object.keys(object).reduce((newObj, currentKey) => {
        if (
            fieldList.indexOf(currentKey) > -1
            && typeof object[currentKey] === 'object'
        ) {
            return { ...newObj, ...object[currentKey] };
        }
        return {
            ...newObj,
            [currentKey]: object[currentKey]
        };
    }, {});

module.exports = {
    flattenChildrenObjectList,
    objectFilterByKeys,
    spreadNestedObject
};
