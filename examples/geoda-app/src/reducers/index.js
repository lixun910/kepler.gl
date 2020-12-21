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

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import keplerGlReducer, {combinedUpdaters, uiStateUpdaters} from 'kepler.gl/reducers';
import {processGeojson, processCsvData} from 'kepler.gl/processors';
import KeplerGlSchema from 'kepler.gl/schemas';
import {EXPORT_MAP_FORMATS} from 'kepler.gl/constants';

import {
  INIT,
  LOAD_MAP_SAMPLE_FILE,
  LOAD_REMOTE_RESOURCE_SUCCESS,
  LOAD_REMOTE_RESOURCE_ERROR,
  SET_SAMPLE_LOADING_STATUS
} from '../actions';

import {AUTH_TOKENS, DEFAULT_FEATURE_FLAGS, GEODA_MAP_ID} from '../constants/default-settings';
import {generateHashId} from '../utils/strings';

import {loadJsgeoda} from '../actions';
import jsgeoda from 'jsgeoda';

// INITIAL_APP_STATE
const initialAppState = {
  appName: 'geoda',
  loaded: false,
  sampleMaps: [], // this is used to store sample maps fetch from a remote json file
  isMapLoading: false, // determine whether we are loading a sample map,
  error: null, // contains error when loading/retrieving data/configuration
  // {
  //   status: null,
  //   message: null
  // }
  // eventually we may have an async process to fetch these from a remote location
  featureFlags: DEFAULT_FEATURE_FLAGS,

  file_ids : {},
  show_verion: false,
  locale: 'en',
  jsgeoda: null,
  mapID: GEODA_MAP_ID,
  currentMapUId : '',
  mapUIds : [],
  fields: {},
  weights: {}
};

// App reducer
export const appReducer = handleActions(
  {
    [INIT]: state => ({
      ...state,
      loaded: true
    }),
    [LOAD_MAP_SAMPLE_FILE]: (state, action) => ({
      ...state,
      sampleMaps: action.samples
    }),
    [SET_SAMPLE_LOADING_STATUS]: (state, action) => ({
      ...state,
      isMapLoading: action.isMapLoading
    })
  },
  initialAppState
);

const {DEFAULT_EXPORT_MAP} = uiStateUpdaters;

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  // In order to provide single file export functionality
  // we are going to set the mapbox access token to be used
  // in the exported file
  uiState: {
    currentModal: null,
    exportMap: {
      ...DEFAULT_EXPORT_MAP,
      [EXPORT_MAP_FORMATS.HTML]: {
        ...DEFAULT_EXPORT_MAP[[EXPORT_MAP_FORMATS.HTML]],
        exportMapboxAccessToken: AUTH_TOKENS.EXPORT_MAPBOX_TOKEN
      }
    }
  },
  visState: {
    loaders: [], // Add additional loaders.gl loaders here
    loadOptions: {} // Add additional loaders.gl loader options here
  }
})
// handle additional actions
.plugin({
  HIDE_AND_SHOW_SIDE_PANEL: (state, action) => ({
    ...state,
    uiState: {
      ...state.uiState,
      readOnly: !state.uiState.readOnly
    }
  }),
  OPEN_FILE_DIALOG: (state, action) => ({
    ...state,
    uiState: {
      ...state.uiState,
      currentModal: 'addData'
    }
  }),
  SHOW_TABLE: (state, action) => ({
    ...state,
    uiState: {
      ...state.uiState,
      currentModal: 'dataTable'
    },
    visState: {
      ...state.visState,
      editingDataset: action.payload
    }
  }),
});

// combine app reducer and keplerGl reducer
// to mimic the reducer state of kepler.gl website
const demoReducer = combineReducers({
  // mount keplerGl reducer
  keplerGl:  customizedKeplerGlReducer,
  geoda: appReducer
});

// this can be moved into a action and call kepler.gl action
/**
 *
 * @param state
 * @param action {map: resultset, config, map}
 * @returns {{app: {isMapLoading: boolean}, keplerGl: {map: (state|*)}}}
 */
export const loadRemoteResourceSuccess = (state, action) => {
  // TODO: replace generate with a different function
  const datasetId = action.options.id || generateHashId(6);
  const {dataUrl} = action.options;
  let processorMethod = processCsvData;
  // TODO: create helper to determine file ext eligibility
  if (dataUrl.includes('.json') || dataUrl.includes('.geojson')) {
    processorMethod = processGeojson;
  }

  const datasets = {
    info: {
      id: datasetId
    },
    data: processorMethod(action.response)
  };

  const config = action.config ? KeplerGlSchema.parseSavedConfig(action.config) : null;

  const keplerGlInstance = combinedUpdaters.addDataToMapUpdater(
    state.keplerGl.map, // "map" is the id of your kepler.gl instance
    {
      payload: {
        datasets,
        config,
        options: {
          centerMap: Boolean(!action.config)
        }
      }
    }
  );

  // process for geoda
  const uid = datasetId; // uid for this map layer
  const ab = new TextEncoder().encode(JSON.stringify(action.response));
  const fields = {};
  fields[uid]  = datasets.data.fields;
  const weights = {};
  weights[uid] = {};

  state.geoda.loaded = true; // enable geoda features
  state.geoda.currentSample =  action.options;
  state.geoda.isMapLoading = false; // we turn off the spinner
  state.geoda.mapUIds = [uid];
  state.geoda.currentMapUid = uid;
  state.geoda.fields = fields;
  state.geoda.weights = weights;
  state.keplerGl.map =  keplerGlInstance; // in case you keep multiple instances

  jsgeoda.New().then(geoda => {
    state["geoda"]["jsgeoda"] = geoda;
    geoda.ReadGeojsonMap(uid, ab);
    return demoReducer(state, action);
  });

  return state;
};

export const loadRemoteResourceError = (state, action) => {
  const {error, url} = action;

  const errorNote = {
    type: 'error',
    message: error.message || `Error loading ${url}`
  };

  return {
    ...state,
    geoda: {
      ...state.geoda,
      isMapLoading: false // we turn of the spinner
    },
    keplerGl: {
      ...state.keplerGl, // in case you keep multiple instances
      map: {
        ...state.keplerGl.map,
        uiState: uiStateUpdaters.addNotificationUpdater(state.keplerGl.map.uiState, {
          payload: errorNote
        })
      }
    }
  };
};

const composedUpdaters = {
  [LOAD_REMOTE_RESOURCE_SUCCESS]: loadRemoteResourceSuccess,
  [LOAD_REMOTE_RESOURCE_ERROR]: loadRemoteResourceError
};

const composedReducer = (state, action) => {
  if (composedUpdaters[action.type]) {
    return composedUpdaters[action.type](state, action);
  }
  switch (action.type) {
    case '@@kepler.gl/LOAD_FILES':
      console.log("load jsgeoda here");
      loadJsgeoda(state, action);
      break;

    case '@@kepler.gl/PROCESS_FILE_CONTENT':
      console.log("get geojson content here");
      break;

    case '@@kepler.gl/LOAD_FILES_SUCCESS':
      // do update; action result has all fields information
      // e.g. {name:'REGION', tableFieldIndex:2, type: 'integer', analyzeTYPE: 'INT'}
      // info {label: "natregimes.geojson", format:"geojson"}
      console.log("after load geojson");
      state.geoda.loaded = true; // enable geoda features
      action.result.map((result, index) => {
        const uid = result.info.label;
        state.geoda.fields[uid] = result.data.fields; // 0 means the top one
        state.geoda.weights[uid] = {}; // empty weights
      });
      break;

    case '@@kepler.gl/LAYER_CONFIG_CHANGE':
      if ('layerData' in action.payload.newConfig) {
        // in case of GeoDa choropleth map, show legend
        state.keplerGl[GEODA_MAP_ID].uiState.mapControls.mapLegend = {show: true, active: true};
      }
      break;

    case '@@kepler.gl/TOGGLE_MAP_CONTROL':
      break;

    case 'OPEN_FILE_DIALOG':
      //state.keplerGl[GEODA_MAP_ID].uiState.currentModal = 'addData';
      break;
  }
  return demoReducer(state, action);
};

// export demoReducer to be combined in website app
export default composedReducer;
