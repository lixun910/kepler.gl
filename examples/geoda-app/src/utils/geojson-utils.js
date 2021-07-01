/**
 * Get column data from geojson
 *
 * @param {Array} content of geojson
 * @param {string} fieldName
 * @returns {array} values of the column
 */
export function getDataByFieldName(rawData, fieldName) {
  const values = [];
  for (const feat of rawData) {
    const v = feat.properties[fieldName];
    values.push(v ? v : 0);
  }
  return values;
}

/**
 * Get numeric fields from geojson
 *
 * @param {Object} Fields info from kepler
 * @returns {array} all numeric fields
 */
export function getNumericFields(fieldsInfo) {
  const fields = [];
  const n = fieldsInfo.length;
  for (let i = 0; i < n; ++i) {
    if (fieldsInfo[i].analyzerType === 'INT' || fieldsInfo[i].analyzerType === 'FLOAT') {
      fields.push(fieldsInfo[i].name);
    }
  }
  return fields;
}
