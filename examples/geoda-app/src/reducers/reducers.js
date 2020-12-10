import {createAction, handleActions} from 'redux-actions';
import KeplerGlSchema from 'kepler.gl/schemas';
import {showDatasetTable} from 'kepler.gl/actions';
import {INIT, SET_MAP_CONFIG, SHOW_MODAL, SHOW_GEODA_INFO, SHOW_TABLE} from '../actions/actions'


// INITIAL_STATE
export const initialState = {
    appName: 'geoda.js',
    loaded: false,
    modal: null,
    file_ids : {},
    show_verion: false,
    jsgeoda: null
};

// REDUCER
const appReducer = handleActions(
    {
      [INIT]: (state, action) => ({
        ...state,
        loaded: true
      }),
      [SET_MAP_CONFIG]: (state, action) => ({
        ...state,
        mapConfig: KeplerGlSchema.getConfigToSave(action.payload)
      }),
      [SHOW_MODAL]: (state, action) => ({
        ...state,
        modal: action.payload
      }),
      [SHOW_GEODA_INFO]: (state, action) => ({
        ...state,
        show_version: action.payload
      }),
    },
    initialState
);

export default appReducer;