import React  from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {FormattedMessage} from 'react-intl';
import {wrapTo, layerConfigChange} from 'kepler.gl/actions';

import {getDataByFieldName, colorbrewer, hexToRgb, hexToRgbStr} from '../../utils';
import VariableSelect from '../utils/field-selector';
import WeightsSelect from '../utils/weights-selector';
import {DialogTitle, DialogContent, DialogActions} from '../modal-dlg';
import DefaultButton from './default-button';

const COLOR_LOCAL_MORAN = [
  "#eeeeee",
  "#FF0000",
  "#0000FF",
  "#a7adf9",
  "#f4ada8",
  "#464646",
  "#999999"
];

const LABEL_LOCAL_MORAN = [
  "Not significant",
  "High-High",
  "Low-Low",
  "High-Low",
  "Low-High",
  "Undefined",
  "Isolated"
]

export default class LocalMoranDialog extends DefaultButton {

  formatNumeric = (val) => {
    if (val == Infinity || val == -Infinity) {
      return val;
    } else if (val === Number(val)) {
      return val;
    } else {
      return val.toFixed(2);
    }
  };

  printRange = (v1, v2) => {
    return '[' + this.formatNumeric(v1) + ', ' + this.formatNumeric(v2) + ')';
  };

  onOKClick = (event) => {
    event.preventDefault();

    const mapID = this.getMapId();
    const varName = this._variableSelect.getSelected();
    const weights = this._weightsSelect.getSelected();
    const cutoff = 0.05;
    const permutations = 999;

    const map_uid = this.getMapUID();
    const jsgeoda = this.getJsGeoDa();
    const oldLayerData = this.getTopLayerData();

    const values = getDataByFieldName(oldLayerData.data, varName);
    const lisa = jsgeoda.local_moran(map_uid, weights.uid, values);
    const colors = COLOR_LOCAL_MORAN.map((hex)=>hexToRgb(hex));
    const lisaCat = jsgeoda.parseVecDouble(lisa.clusters());
    const pValues = jsgeoda.parseVecDouble(lisa.significances());

    const returnFillColor = (obj, element) => {
      let i = lisaCat[element.index];
      return colors[i];
    };

    // used to trigger legend update: adding colorLegends
    // { "rgba()" : "label1"}
    var colorLegends = {};
    for (let i=0; i<colors.length; ++i) {
      let hex = COLOR_LOCAL_MORAN[i];
      let clr = hexToRgbStr(hex);
      let lbl = LABEL_LOCAL_MORAN[i];
      colorLegends[clr] = lbl;
    }

    var oldLayer = this.getTopLayer();

    var newConfig = {
        color: [0,255,0],  // color is not used but can trigger the map to redraw
        layerData: {getFillColor: returnFillColor},
        colorField: {
          name: varName,
          type: 'integer'
        }, // trigger updating legend
        visConfig: {
          ...oldLayer.config.visConfig,
          colorRange : {
            colors: COLOR_LOCAL_MORAN,
            colorLegends: colorLegends,
            colorMap: null // avoid getColorScale() to overwrite custom color
          }
        }
    };
    this.props.dispatch(wrapTo(mapID, layerConfigChange(oldLayer, newConfig)));
  };

  handleClose = ()=> {
    this.props.close('UNI_LOCAL_MORAN');
  }

  render() {
      return (
        <Dialog onClose={this.handleClose} aria-labelledby="localmoran-dialog" open={this.props.open}>
          <DialogTitle id="localmoran-dialog-title" onClose={this.handleClose}>
            <FormattedMessage id={'geoda.sa.unilocalmoran'} />
          </DialogTitle>
          <form autoComplete="off" onSubmit={this.onOKClick} >
            <DialogContent dividers>

            <VariableSelect
              ref={(ref) => this._variableSelect = ref}
              fields={this.getFields()}
              fieldType={['integer', 'real']} />

            <WeightsSelect
              ref={(ref) => this._weightsSelect = ref}
              weightsItems={this.getWeights()}
              />

            </DialogContent>
            <DialogActions>
              <Button autoFocus type="submit" color="primary">
                <FormattedMessage id={'geoda.ok'} />
              </Button>
              <Button autoFocus onClick={this.handleClose} color="primary">
                <FormattedMessage id={'geoda.close'} />
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      );
  }
}
