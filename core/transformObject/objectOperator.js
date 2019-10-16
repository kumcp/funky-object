/**
 * Check if all props inside objectExtract contained
 * and has the same value in objectCheck or not. (not recursive)
 * Ex:
 * ```
 * isContain({a:1, b:2, c:3}, {b:2, c:3}) == true
 * isContain({a:1, b:2, c:3}, {d:4}) == false
 * ```
 * @param {{}} objectExtract
 * @param {{}} objectCheck
 *
 * @return {Boolean} return
 */
const isContain = (objectExtract, objectCheck) => {
    const keys = Object.keys(objectExtract);
    const failedCheck = keys
        .filter(key => objectExtract[key])
        .map(key => objectExtract[key] === objectCheck[key])
        .filter(resultCheck => !resultCheck);
    return failedCheck.length === 0;
};

/**
 * Check if all props value in obj1 is equal exactly in obj2, no more, no less
 *
 * <SHORT + may be slow version>
 * @param {{}} obj1
 * @param {{}} obj2
 */
const isEqual = (obj1, obj2) => isContain(obj1, obj2) && isContain(obj2, obj1);

module.exports = { isContain, isEqual };
