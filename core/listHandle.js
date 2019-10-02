/**
 * Sum if the current value make the conditionFic to be true.
 *
 *
 * Ex: sumIf([1,2,3,4,5], item => item % 2 ===0 ): Sum all item is multiply of 2
 *
 * @param {*} arrayList
 * @param {*} conditionFunc
 */
const sumIf = (arrayList, conditionFunc) => {
    if (!Array.isArray(arrayList)) throw new Error('input should be an array');
    return arrayList.reduce(
        (prevValue, currentValue) =>
            (conditionFunc(currentValue) ? prevValue + currentValue : prevValue),
        []
    );
};

/**
 * Sum the value has key if the current item make the conditionFic to be true.
 *
 * Ex: sumByKeyIf([{name: "Tom", hours: 10}, {name: "Tam", hours: 15}], "hours", obj => true )
 * Summary all "hours" inside list
 *
 * @param {Array} arrayList
 * @param {String} key
 * @param {(item) => {}} conditionFunc
 */
const sumByKeyIf = (arrayList, key, conditionFunc) => {
    if (!Array.isArray(arrayList)) throw new Error('input should be an array');
    return arrayList.reduce(
        (prevValue, currentValue) =>
            (conditionFunc(currentValue)
                ? prevValue + currentValue[key]
                : prevValue),
        []
    );
};

const removeDuplicate = (arrayList, duplicateLogic) => {
    if (!Array.isArray(arrayList)) throw new Error('input should be an array');
    return arrayList.reduce((prev, current) => {
        if (!prev.some(val => duplicateLogic(val, current))) {
            return [...prev, current];
        }
        return prev;
    }, []);
};

const sumUp = arrayList => sumIf(arrayList, () => true);

const sumByKey = (arrayList, key) => sumByKeyIf(arrayList, key, () => true);

/**
 * Remove duplicate object in object list.
 * removeDuplicateByKey([{a: 1, b: 6}, {a:1, c: 3}, {a:2, b:3}], "a")
 *  => [{a:1, b:6}, {a:2, b:3}]
 *
 * @param {*} arrayList
 * @param {*} key
 */
const removeDuplicateByKey = (arrayList, key) =>
    removeDuplicate(arrayList, (newVal, oldVal) => newVal[key] === oldVal[key]);


module.exports = {
    sumUp,
    sumByKey,
    removeDuplicateByKey,
    sumIf,
    sumByKeyIf,
    removeDuplicate
};
