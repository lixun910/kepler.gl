import {handleActions} from 'redux-actions';
import {INIT, SHOW_GEODA_INFO} from '../actions/actions'

import {GEODA_MAP_ID} from '../constants';

// INITIAL_STATE
export const initialState = {
    appName: 'geoda.js',
    loaded: false,
    file_ids : {},
    show_verion: false,
    jsgeoda: null,
    locale: 'en',
    mapID: GEODA_MAP_ID,
    fields: []
};

// REDUCER
const appReducer = handleActions(
    {
      [INIT]: (state, action) => ({
        ...state,
        loaded: true
      }),
      [SHOW_GEODA_INFO]: (state, action) => ({
        ...state,
        show_version: action.payload
      }),
    },
    initialState
);

export default appReducer;
