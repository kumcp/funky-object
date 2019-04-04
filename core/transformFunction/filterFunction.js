/**
 * Filter functions in object
 *
 * @param {*} object need to filter
 *
 * @returns {Array} list of function in object
 */
const filterFunction = object => {
    return Object.keys(object)
        .filter(key => {
            return typeof object[key] === 'function';
        })
        .map(key => object[key]);
};

module.exports = {
    filterFunction
};
