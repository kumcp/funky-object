const fs = require('fs');

// Other module
const { escapeValueCSV } = require('./escape');

const defaultOption = {
    separator: ',',
    endLine: '\n',
    nullValue: ''
};

const fileName = `${__dirname}/obj.csv`;

/**
 * Combine the input options and default options. If input options
 * specifies, then take from input options. Otherwise, take from default options.
 *
 * @param {*} inputOptions input options
 *
 * @returns {Object} new object contain the combination of input options and default options
 */
const combineDefaultOptions = inputOptions => {
    return {
        ...defaultOption,
        ...inputOptions
    };
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
    return fieldRequire.map(field => escapeValueCSV(object[field]) || options.nullValue);
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
    return getListValueRequire(object, fieldRequire, inputOptions).join(options.separator);
};

const setValueRequire = (line, fieldRequire, inputOptions = {}) => {
    const options = combineDefaultOptions(inputOptions);
    const values = line.split(options.separator);
    return fieldRequire.reduce(
        (prevObj, field, fieldIndex) => ({
            ...prevObj,
            [field]: values[fieldIndex] ? values[fieldIndex].trim() : ''
        }),
        {}
    );
};

/**
 * Convert an object list into line string list for csv
 *
 * @param {*} objectList list data object value
 * @param {Array} fieldRequire List of require fields to show
 * @param {defaultOption} inputOptions options
 */
const convertObjList2LineList = (objectList, fieldRequire, inputOptions = {}) => {
    const options = combineDefaultOptions(inputOptions);

    const resultHeader = fieldRequire.join(options.separator);
    const resultList = [resultHeader];
    return objectList.reduce(
        (resultObj, currentObject) => [...resultObj, getLineValueRequire(currentObject, fieldRequire, inputOptions)],
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
const saveObjectListCSVFile = (objectList, fieldRequire, filePath, inputOptions = {}) => {
    return saveLineCSVFile(convertObjList2LineList(objectList, fieldRequire), filePath, inputOptions);
};

/**
 * Read csv file and return as a string
 * @param {*} filePath
 *
 * @returns {String} data in file
 */
const readCSV = async filePath => {
    return await fs.readFileSync(filePath, { encoding: 'utf8' });
};

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
    const headers = (lines[0] || '').split(options.separator).map(header => header.trim());
    return lines.filter((line, index) => index > 0).map(lineString => setValueRequire(lineString, headers));
};

module.exports = {
    saveObjectListCSVFile,
    saveLineCSVFile,
    readCSVtoObjectList
};
