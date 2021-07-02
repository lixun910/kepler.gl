// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {createAction} from 'redux-actions';
import {push} from 'react-router-redux';
import {request, text as requestText, json as requestJson} from 'd3-request';
import {loadFiles, toggleModal} from 'kepler.gl/actions';
import {
  LOADING_SAMPLE_ERROR_MESSAGE,
  LOADING_SAMPLE_LIST_ERROR_MESSAGE,
  MAP_CONFIG_URL
} from './constants/default-settings';
import {parseUri} from './utils/url';
import {colorbrewer, hexToRgb, hexToRgbStr} from './utils';

import jsgeoda from 'jsgeoda';

// CONSTANTS
export const INIT = 'INIT';
export const LOAD_REMOTE_RESOURCE_SUCCESS = 'LOAD_REMOTE_RESOURCE_SUCCESS';
export const LOAD_REMOTE_RESOURCE_ERROR = 'LOAD_REMOTE_RESOURCE_ERROR';
export const LOAD_MAP_SAMPLE_FILE = 'LOAD_MAP_SAMPLE_FILE';
export const SET_SAMPLE_LOADING_STATUS = 'SET_SAMPLE_LOADING_STATUS';

// Sharing
export const PUSHING_FILE = 'PUSHING_FILE';
export const CLOUD_LOGIN_SUCCESS = 'CLOUD_LOGIN_SUCCESS';

// ACTIONS
export function initApp() {
  return {
    type: INIT
  };
}

export function loadRemoteResourceSuccess(response, config, options) {
  return {
    type: LOAD_REMOTE_RESOURCE_SUCCESS,
    response,
    config,
    options
  };
}

export function loadRemoteResourceError(error, url) {
  return {
    type: LOAD_REMOTE_RESOURCE_ERROR,
    error,
    url
  };
}

export function loadMapSampleFile(samples) {
  return {
    type: LOAD_MAP_SAMPLE_FILE,
    samples
  };
}

export function setLoadingMapStatus(isMapLoading) {
  return {
    type: SET_SAMPLE_LOADING_STATUS,
    isMapLoading
  };
}

/**
 * Actions passed to kepler.gl, called
 *
 * Note: exportFile is called on both saving and sharing
 *
 * @param {*} param0
 */
export function onExportFileSuccess({response = {}, provider, options}) {
  return dispatch => {
    // if isPublic is true, use share Url
    if (options.isPublic && provider.getShareUrl) {
      dispatch(push(provider.getShareUrl(false)));
    } else if (!options.isPublic && provider.getMapUrl) {
      // if save private map to storage, use map url
      dispatch(push(provider.getMapUrl(false)));
    }
  };
}

export function onLoadCloudMapSuccess({response, provider, loadParams}) {
  return dispatch => {
    if (provider.getMapUrl) {
      const mapUrl = provider.getMapUrl(false, loadParams);
      dispatch(push(mapUrl));
    }
  };
}
/**
 * this method detects whther the response status is < 200 or > 300 in case the error
 * is not caught by the actualy request framework
 * @param response the response
 * @returns {{status: *, message: (*|{statusCode}|Object)}}
 */
function detectResponseError(response) {
  if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
    return {
      status: response.statusCode,
      message: response.body || response.message || response
    };
  }
}

// This can be moved into Kepler.gl to provide ability to load data from remote URLs
/**
 * The method is able to load both data and kepler.gl files.
 * It uses loadFile action to dispatcha and add new datasets/configs
 * to the kepler.gl instance
 * @param options
 * @param {string} options.dataUrl the URL to fetch data from. Current supoprted file type json,csv, kepler.json
 * @returns {Function}
 */
export function loadRemoteMap(options) {
  return dispatch => {
    dispatch(setLoadingMapStatus(true));
    // breakdown url into url+query params
    loadRemoteRawData(options.dataUrl).then(
      // In this part we turn the response into a FileBlob
      // so we can use it to call loadFiles
      ([file, url]) => {
        const {file: filename} = parseUri(url);
        dispatch(loadFiles([new File([file], filename)])).then(() =>
          dispatch(setLoadingMapStatus(false))
        );
      },
      error => {
        const {target = {}} = error;
        const {status, responseText} = target;
        dispatch(loadRemoteResourceError({status, message: responseText}, options.dataUrl));
      }
    );
  };
}

/**
 * Load a file from a remote URL
 * @param url
 * @returns {Promise<any>}
 */
function loadRemoteRawData(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    request(url, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      const responseError = detectResponseError(result);
      if (responseError) {
        reject(responseError);
        return;
      }
      resolve([result.response, url]);
    });
  });
}

// The following methods are only used to load SAMPLES
/**
 *
 * @param {Object} options
 * @param {string} [options.dataUrl] the URL to fetch data from, e.g. https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/earthquakes/data.csv
 * @param {string} [options.configUrl] the URL string to fetch kepler config from, e.g. https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/earthquakes/config.json
 * @param {string} [options.id] the id used as dataset unique identifier, e.g. earthquakes
 * @param {string} [options.label] the label used to describe the new dataset, e.g. California Earthquakes
 * @param {string} [options.queryType] the type of query to execute to load data/config, e.g. sample
 * @param {string} [options.imageUrl] the URL to fetch the dataset image to use in sample gallery
 * @param {string} [options.description] the description used in sample galley to define the current example
 * @param {string} [options.size] the number of entries displayed in the current sample
 * @param {string} [keplergl] url to fetch the full data/config generated by kepler
 * @returns {Function}
 */
export function loadSample(options, pushRoute = true) {
  return (dispatch, getState) => {
    const {routing} = getState();
    if (options.id && pushRoute) {
      dispatch(push(`/demo/${options.id}${routing.locationBeforeTransitions.search}`));
    }
    // if the sample has a kepler.gl config file url we load it
    if (options.keplergl) {
      dispatch(loadRemoteMap({dataUrl: options.keplergl}));
    } else {
      dispatch(loadRemoteSampleMap(options));
    }

    dispatch(setLoadingMapStatus(true));
  };
}

/**
 * Load remote map with config and data
 * @param options {configUrl, dataUrl}
 * @returns {Function}
 */
function loadRemoteSampleMap(options) {
  return dispatch => {
    // Load configuration first
    const {configUrl, dataUrl} = options;

    Promise.all([loadRemoteConfig(configUrl), loadRemoteData(dataUrl)]).then(
      ([config, data]) => {
        // TODO: these two actions can be merged
        dispatch(loadRemoteResourceSuccess(data, config, options));
        dispatch(toggleModal(null));
      },
      error => {
        if (error) {
          const {target = {}} = error;
          const {status, responseText} = target;
          dispatch(
            loadRemoteResourceError(
              {
                status,
                message: `${responseText} - ${LOADING_SAMPLE_ERROR_MESSAGE} ${options.id} (${configUrl})`
              },
              configUrl
            )
          );
        }
      }
    );
  };
}

/**
 *
 * @param url
 * @returns {Promise<any>}
 */
function loadRemoteConfig(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    requestJson(url, (error, config) => {
      if (error) {
        reject(error);
        return;
      }
      const responseError = detectResponseError(config);
      if (responseError) {
        reject(responseError);
        return;
      }
      resolve(config);
    });
  });
}

/**
 *
 * @param url to fetch data from (csv, json, geojson)
 * @returns {Promise<any>}
 */
function loadRemoteData(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null);
  }

  let requestMethod = requestText;
  if (url.includes('.json') || url.includes('.geojson')) {
    requestMethod = requestJson;
  }

  // Load data
  return new Promise((resolve, reject) => {
    requestMethod(url, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      const responseError = detectResponseError(result);
      if (responseError) {
        reject(responseError);
        return;
      }
      resolve(result);
    });
  });
}

/**
 *
 * @param sampleMapId optional if we pass the sampleMapId, after fetching
 * map sample configurations we are going to load the actual map data if it exists
 * @returns {function(*)}
 */
export function loadSampleConfigurations(sampleMapId = null) {
  return dispatch => {
    requestJson(MAP_CONFIG_URL, (error, samples) => {
      if (error) {
        const {target = {}} = error;
        const {status, responseText} = target;
        dispatch(
          loadRemoteResourceError(
            {status, message: `${responseText} - ${LOADING_SAMPLE_LIST_ERROR_MESSAGE}`},
            MAP_CONFIG_URL
          )
        );
      } else {
        const responseError = detectResponseError(samples);
        if (responseError) {
          dispatch(loadRemoteResourceError(responseError, MAP_CONFIG_URL));
          return;
        }

        dispatch(loadMapSampleFile(samples));
        // Load the specified map
        const map = sampleMapId && samples.find(s => s.id === sampleMapId);
        if (map) {
          dispatch(loadSample(map, false));
        }
      }
    });
  };
}

// Actions for GeoDa
export const hideAndShowSidePanel = createAction('HIDE_AND_SHOW_SIDE_PANEL');

export const openFileDialog = createAction('OPEN_FILE_DIALOG');

export function loadJsgeoda(state, action) {
  jsgeoda.New().then(geoda => {
    state.geoda.jsgeoda = geoda;
    const loadJsFiles = action.payload.files;
    for (let i = 0; i < loadJsFiles.length; ++i) {
      const f = loadJsFiles[i];
      state.geoda.file_ids[f.name] = true;
      var fileReader = new FileReader();
      fileReader.onload = event => {
        const ab = event.target.result;
        const fname = event.target.fileName;
        const map_uid = geoda.ReadGeojsonMap(fname, ab);
        state.geoda.mapUIds.push(map_uid);
        state.geoda.currentMapUid = map_uid;
      };
      fileReader.readAsArrayBuffer(f);
      fileReader.fileName = f.name;
    }
  });
}

export function weightsCreationAction(weightsCreationConf) {
  return {
    type: 'CREATE_WEIGHTS',
    payload: weightsCreationConf
  };
}

export function createWeights(state, action) {
  let w = null;
  const conf = action.payload;
  const mapUid = state.geoda.currentMapUid;
  const geoda = state.geoda.jsgeoda;

  if (conf.WeightsType === 'contiguity') {
    const order = conf.contiguity.Order;
    const includeLowerOrder = conf.contiguity.IncludeLowerOrder;
    const precisionThreshold = conf.contiguity.PrecisionThresholdValue;
    if (conf.contiguity.ContiguityType === 'rook') {
      w = geoda.CreateRookWeights(mapUid, order, includeLowerOrder, precisionThreshold);
    } else {
      w = geoda.CreateQueenWeights(mapUid, order, includeLowerOrder, precisionThreshold);
    }
  } else if (conf.WeightsType === 'distance') {
    // placeholder
    // not implemented yet
  }

  const weightsUniqueId = w.get_uid();
  const n = Object.keys(state.geoda.weights[mapUid]).length;
  state.geoda.weights[mapUid][weightsUniqueId] = {
    idx: n,
    uid: weightsUniqueId,
    name: conf.weightsName,
    type: conf.WeightsType,
    isSymmetric: w.get_is_symmetric() ? 'yes' : 'no',
    numObs: w.get_num_obs(),
    minNbrs: w.get_min_nbrs(),
    maxNbrs: w.get_max_nbrs(),
    meanNbrs: w.get_mean_nbrs(),
    medianNbrs: w.get_median_nbrs(),
    sparsity: w.get_sparsity(),
    density: w.get_density()
  };

  return state;
}

export function createChroplethMap(conf) {
  const mapUid = conf.mapUid;
  const geoda = conf.jsgeoda;
  const k = conf.k;
  const colorName = conf.colorName;
  const varName = conf.varName;
  const oldLayer = conf.oldLayer;

  const nb = geoda.custom_breaks(mapUid, conf.selectedMethod, k, null, conf.values);
  const colors = colorbrewer[colorName][k].map(hex => hexToRgb(hex));

  const returnFillColor = (obj, index) => {
    const x = obj.properties[varName];
    for (var i = 1; i < nb.breaks.length; ++i) {
      if (x < nb.breaks[i]) return colors[i - 1];
    }
    return [255, 255, 255];
  };

  const formatNumeric = val => {
    if (val === Infinity || val === -Infinity) {
      return val;
    } else if (val === Number(val)) {
      return val;
    }
    return val.toFixed(2);
  };

  const printRange = (v1, v2) => {
    return `[${formatNumeric(v1)}, ${formatNumeric(v2)})`;
  };

  // used to trigger legend update: adding colorLegends
  // { "rgba()" : "label1"}
  const colorLegends = {};
  for (let i = 0; i < k; ++i) {
    const hex = colorbrewer[colorName][k][i];
    const clr = hexToRgbStr(hex);
    const lbl = printRange(nb.breaks[i], nb.breaks[i + 1]);
    colorLegends[clr] = lbl;
  }

  const newConfig = {
    color: [0, 255, 0], // color is not used but can trigger the map to redraw
    layerData: {getFillColor: returnFillColor},
    colorField: {
      name: varName,
      type: 'integer'
    }, // trigger updating legend
    visConfig: {
      ...oldLayer.config.visConfig,
      colorRange: {
        colors: colorbrewer[colorName][k],
        colorLegends,
        colorMap: null // avoid getColorScale() to overwrite custom color
      }
    }
  };

  return newConfig;
}

export function createLocalMoranMap(conf) {
  const COLOR_LOCAL_MORAN = [
    '#eeeeee',
    '#FF0000',
    '#0000FF',
    '#a7adf9',
    '#f4ada8',
    '#464646',
    '#999999'
  ];
  const LABEL_LOCAL_MORAN = [
    'Not significant',
    'High-High',
    'Low-Low',
    'High-Low',
    'Low-High',
    'Undefined',
    'Isolated'
  ];
  const mapUid = conf.mapUid;
  const wuid = conf.wuid;
  const geoda = conf.jsgeoda;
  const values = conf.values;
  const varName = conf.varName;
  const oldLayer = conf.oldLayer;
  // const cutoff = 0.05;
  // const permutations = 999;

  const colors = COLOR_LOCAL_MORAN.map(hex => hexToRgb(hex));

  const lisa = geoda.local_moran(mapUid, wuid, values);
  const lisaCat = geoda.parseVecDouble(lisa.clusters());

  const returnFillColor = (obj, element) => {
    const i = lisaCat[element.index];
    return colors[i];
  };

  // used to trigger legend update: adding colorLegends
  // { "rgba()" : "label1"}
  const colorLegends = {};
  for (let i = 0; i < colors.length; ++i) {
    const hex = COLOR_LOCAL_MORAN[i];
    const clr = hexToRgbStr(hex);
    const lbl = LABEL_LOCAL_MORAN[i];
    colorLegends[clr] = lbl;
  }

  const newConfig = {
    color: [0, 255, 0], // color is not used but can trigger the map to redraw
    layerData: {getFillColor: returnFillColor},
    colorField: {
      name: varName,
      type: 'integer'
    }, // trigger updating legend
    visConfig: {
      ...oldLayer.config.visConfig,
      colorRange: {
        colors: COLOR_LOCAL_MORAN,
        colorLegends,
        colorMap: null // avoid getColorScale() to overwrite custom color
      }
    }
  };

  return newConfig;
}
