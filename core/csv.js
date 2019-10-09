const fs = require('fs');

// Other module
const { escapeValueCSV } = require('./escape');

const defaultOption = {
    separator: ',',
    endLine: '\n',
    nullValue: '',
    stringDelimiter: '"'
};

/**
 * Combine the input options and default options. If input options
 * specifies, then take from input options. Otherwise, take from default options.
 *
 * @param {*} inputOptions input options
 *
 * @returns {Object} new object contain the combination of input options and default options
 */
const combineDefaultOptions = (inputOptions) => ({
    ...defaultOption,
    ...inputOptions
});

// WRITE CSV file

const separateStringAsCSVFormat = (line, inputOption = {}) => {
    const options = combineDefaultOptions(inputOption);
    const sep = options.separator;
    const strDlmter = options.stringDelimiter;
    const splitOperator = new RegExp(
        `(^([^${sep}^${strDlmter}]*)${sep}|`
            + `${sep}|`
            + `([^${strDlmter}][^${sep}]*)${sep}|`
            + `${strDlmter}((?:(?!${strDlmter}${sep}).)*)${strDlmter}${sep}|`
            + `([^${strDlmter}][^${sep}]*)$|`
            + `${strDlmter}((?:(?!${strDlmter}${sep}).)*)${strDlmter}$)`,
        'g'
    );
    // const values = line.split(options.separator);
    return ((line || '').match(splitOperator) || [])
        .map((item) => {
            let neatString = item;

            if (neatString === '') {
                return undefined;
            }

            if (
                neatString.charAt(neatString.length - 1) === options.separator
            ) {
                neatString = neatString.substr(0, neatString.length - 1);
            }

            if (
                neatString.charAt(0) === options.stringDelimiter
                && neatString.charAt(neatString.length - 1)
                    === options.stringDelimiter
            ) {
                neatString = neatString.substr(1, neatString.length - 2);
            }

            return neatString;
        })
        .filter((item) => item !== undefined);
};

/**
 * Get require field from object as a list
 * @param {*} object contain data value
 * @param {Array} fieldRequire List of require fields to show
 * @param {defaultOption} inputOptions options
 *
 * @returns {Array} list of value follow order of fieldRequire
 */
const getListValueRequire = (object, fieldRequire, inputOptions = {}) => {
    const options = combineDefaultOptions(inputOptions);
    return fieldRequire.map((field) =>
        (object[field] === undefined
            ? options.nullValue
            : escapeValueCSV(object[field], [
                options.separator,
                options.endLine
            ])));
};

/**
 * Get require field from object as line string for CSV
 *
 * @param {*} object contain data value
 * @param {Array} fieldRequire List of require fields to show
 * @param {defaultOption} inputOptions options
 *
 * @returns {String} a string represent for a line in CSV
 */
const getLineValueRequire = (object, fieldRequire, inputOptions = {}) => {
    const options = combineDefaultOptions(inputOptions);
    return getListValueRequire(object, fieldRequire, inputOptions).join(
        options.separator
    );
};

/**
 * Convert an object list into line string list for csv
 *
 * @param {*} objectList list data object value
 * @param {Array} fieldRequire List of require fields to show
 * @param {defaultOption} inputOptions options
 */
const convertObjList2LineList = (
    objectList,
    fieldRequire,
    inputOptions = {}
) => {
    const options = combineDefaultOptions(inputOptions);

    const resultHeader = fieldRequire.join(options.separator);
    const resultList = [resultHeader];
    return objectList.reduce(
        (resultObj, currentObject) => [
            ...resultObj,
            getLineValueRequire(currentObject, fieldRequire, inputOptions)
        ],
        resultList
    );
};

/**
 * Write list of line string to CSV file
 *
 * @param {*} lineStringList contain line String value data
 * @param {*} filePath csv file path
 * @param {*} inputOptions options
 */
const saveLineCSVFile = async (lineStringList, filePath, inputOptions = {}) => {
    const options = combineDefaultOptions(inputOptions);
    const fileData = lineStringList.join(options.endLine);
    await fs.writeFileSync(filePath, fileData);
};

/**
 * Write list of object to CSV file
 * @param {*} objectList contain value data
 * @param {*} fieldRequire list of field require in order
 * @param {*} filePath csv file path
 * @param {*} inputOptions options
 */
const saveObjectListCSVFile = (
    objectList,
    fieldRequire,
    filePath,
    inputOptions = {}
) =>
    saveLineCSVFile(
        convertObjList2LineList(objectList, fieldRequire),
        filePath,
        inputOptions
    );

// READ CSV file

/**
 * Set value from csv line to object with coresponding keys
 * Ex:
 *
 * setValueRequire("1, Hellen, 45", ["id", "name", "age"])
 * // => {id: 1, name: "Hellen", age: 45}
 *
 * @param {*} line
 * @param {*} fieldRequire
 * @param {*} inputOptions
 */
const setValueRequire = (line, fieldRequire, inputOptions = {}) => {
    const options = combineDefaultOptions(inputOptions);
    // const values = line.split(options.separator);
    const values = separateStringAsCSVFormat(line, options);
    return fieldRequire.reduce(
        (prevObj, field, fieldIndex) => ({
            ...prevObj,
            [field]:
                values[fieldIndex] !== undefined
                    ? values[fieldIndex].trim()
                    : ''
        }),
        {}
    );
};

/**
 * Set values from line list to object with corresponding header (line 0)
 *
 * Ex:
 * ```
 * setLineListValue([
 *  "id, name, age",
 *  "1, Hellen, 30",
 *  "2, Cao, 26"
 * ])
 *
 *  // => [
 *      { id: 1, name: "Hellen", age: 30 },
 *      { id: 2, name: "Cao", age: 26 },
 *      ]
 * ```
 * @param {Array} lines contains a list of string line
 */
const setLineListValue = (lines) => {
    const headers = separateStringAsCSVFormat(lines[0]);
    return lines
        .filter((line, index) => index > 0)
        .map((lineString) => setValueRequire(lineString, headers));
};

/**
 * Read csv file and return as a string
 * @param {*} filePath
 *
 * @returns {String} data in file
 */
const readCSV = (filePath) => fs.readFileSync(filePath, { encoding: 'utf8' });

/**
 * Read csv file and turn into a line string list
 *
 * @param {*} filePath point to the csv file
 * @param {*} inputOptions options
 *
 * @returns {Array} Line list from csv file
 */
const readCSVtoLineList = async (filePath, inputOptions = {}) => {
    const options = combineDefaultOptions(inputOptions);
    const lineData = await readCSV(filePath);
    return lineData.split(options.endLine);
};

/**
 * Read csv file and turn into object list with keys are the headers and
 * values are string in the rows
 *
 * @param {*} filePath point to the csv file
 * @param {*} inputOptions options
 */
const readCSVtoObjectList = async (filePath, inputOptions = {}) => {
    const options = combineDefaultOptions(inputOptions);

    const lines = await readCSVtoLineList(filePath, options);

    return setLineListValue(lines);
};

module.exports = {
    saveObjectListCSVFile,
    saveLineCSVFile,
    readCSVtoLineList,
    readCSVtoObjectList,
    separateStringAsCSVFormat,
    setLineListValue,
    getLineValueRequire
};
