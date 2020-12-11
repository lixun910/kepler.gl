import {createAction} from 'redux-actions';
import jsgeoda from 'jsgeoda';

// CONSTANTS
export const INIT = 'INIT';
export const SHOW_GEODA_INFO = 'SHOW_GEODA_INFO';
export const SHOW_TABLE = 'SHOW_TABLE';
export const CLASSIFY_MAP = 'CLASSIFY_MAP';

// ACTIONS
export const appInit = createAction(INIT);

// extra actions plugged into kepler.gl reducer (store.js)
export const hideAndShowSidePanel = createAction('HIDE_AND_SHOW_SIDE_PANEL');
export const openFileDialog = createAction('OPEN_FILE_DIALOG');
export const showGeoDaInfo = createAction(SHOW_GEODA_INFO);
export const showTable = createAction(SHOW_TABLE, (dataId) => { return dataId;});
export const classifyMap = createAction(CLASSIFY_MAP);

// @@kepler.gl/LOAD_FILES
export function loadJsgeoda(state, action) {
  jsgeoda.New().then(geoda => {
    state["geoda"]["jsgeoda"] = geoda;
    const loadFiles = action.payload.files;
    for (let i=0; i<loadFiles.length; ++i) {
      const f = loadFiles[i];
      state.geoda.file_ids[f.name] = true;
      var fileReader = new FileReader();
      fileReader.onload = function (event) {
        const ab = event.target.result;
        const fname = event.target.fileName;
        let map_uid = geoda.ReadGeojsonMap(fname, ab);
        state["geoda"]["map_uid"] = map_uid;
      };
      fileReader.readAsArrayBuffer(f);
      fileReader.fileName = f.name;
    }
  });
}
