const escapeNewLine = val => val.replace(/[\n\r]/g, '');

/**
 * Escape value in CSV (Which has comma mark)
 * @param {*} val
 */
const escapeValueCSV = (val, escapeValues = [',']) =>
    (escapeValues.map(item => `${val}`.indexOf(item) >= 0).filter(containSpecialCharacter => containSpecialCharacter)
        .length > 0
        ? escapeNewLine(`"${val}"`)
        : val);

module.exports = {
    escapeValueCSV,
    escapeNewLine
};
