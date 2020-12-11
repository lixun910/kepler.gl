
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
