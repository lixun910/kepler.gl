
/**
 * Get column data from geojson
 *
 * @param {Array} content of geojson
 * @param {string} fieldName
 * @returns {array} values of the column
 */
export function getDataByFieldName(rawData, fieldName){
  let values = [];
  for (const feat of rawData) {
    values.push(feat.properties[fieldName]);
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
  let fields = [];
  const n = fieldsInfo.length;
  for (let i=0; i<n; ++i) {
    if (fieldsInfo[i].analyzerType == "INT" ||
        fieldsInfo[i].analyzerType == "FLOAT") {
      fields.push(fieldsInfo[i].name);
    }
  }
  return fields;
}
