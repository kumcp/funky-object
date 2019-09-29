/**
 * Escape value in CSV (Which has comma mark)
 * @param {*} val
 */
const escapeValueCSV = val => (`${val}`.indexOf(',') >= 0 ? `"${val}"` : val);

const escapeNewLine = val => val.replace(/[\n\r]/g, '');

module.exports = {
    escapeValueCSV,
    escapeNewLine
};
