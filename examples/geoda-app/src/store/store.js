import keplerGlReducer, {uiStateUpdaters, visStateUpdaters} from "kepler.gl/reducers";
import {enhanceReduxMiddleware} from 'kepler.gl/middleware';
import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import appReducer from '../reducers/reducers';
import window from 'global/window';
import {loadJsgeoda} from '../actions/actions';

const customizedKeplerGlReducer = keplerGlReducer.initialState({
    uiState: {
      activeSidePanel: null, // set null to hide side panel when mounted, default 'layer'
      currentModal: null, // set null to hide all modals whtn mounted, 'addData'
      readOnly: false, // set true to hide side panel to disallower user customize the map
      activeMapIndex: 0, // defines which map the user clicked on
      // customize which map control button to show
      mapControls: {
        ...uiStateUpdaters.DEFAULT_MAP_CONTROLS,
        visibleLayers: {show: true},
        mapLegend: {show: false, active: false},
        toggle3d: {show: true},
        splitMap: {show: false}
      },
    },
    visState : {
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

const reducers = combineReducers({
    // mount keplerGl reducer
    keplerGl: customizedKeplerGlReducer,
    // mount geoda reducer
    geoda: appReducer
});

const composedReducer = (state, action) => {
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
      break;

    case '@@kepler.gl/LAYER_CONFIG_CHANGE':
      break;
  }
  return reducers(state, action);
 };

const middlewares = enhanceReduxMiddleware([
    // Add other middlewares here
]);

// redux.applyMiddleware()
const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

// add redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(composedReducer, initialState, composeEnhancers(...enhancers));
