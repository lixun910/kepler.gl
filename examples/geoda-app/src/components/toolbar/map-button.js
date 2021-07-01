import React  from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {FormattedMessage} from 'react-intl';
import {wrapTo, layerConfigChange} from 'kepler.gl/actions';

import {getDataByFieldName, colorbrewer, hexToRgb, hexToRgbStr} from '../../utils';
import VariableSelect from '../utils/field-selector';
import MapTypeSelect from './maptype-selector';
import {DialogTitle, DialogContent, DialogActions} from '../modal-dlg';
import DefaultButton from './default-button';

const COLOR_NAME = {
  natural_breaks: 'YlOrBr',
  quantile_breaks: 'YlOrBr',
  percentile_breaks: 'BuRd',
  hinge15_breaks: 'BuRd',
  hinge30_breaks: 'BuRd',
  stddev_breaks: 'BuRd',
  equaninterval_breaks: 'YlOrBr'
};

export default class GeoDaMapButton extends DefaultButton {
  formatNumeric = val => {
    if (val === Infinity || val === -Infinity) {
      return val;
    } else if (val === Number(val)) {
      return val;
    }
    return val.toFixed(2);
  };

  printRange = (v1, v2) => {
    return `[${this.formatNumeric(v1)}, ${this.formatNumeric(v2)})`;
  };

  createThemeMap = () => {
    // send layerConfigChange action to kepler
    // 0 means always apply on the top layer
    const mapID = this.getMapId();
    const varName = this._variableSelect.getSelected();
    const k = this._mapTypeSelect.getCategoryNumber();
    const selectedMethod = this._mapTypeSelect.getMapType();
    const colorName = COLOR_NAME[selectedMethod];
    const map_uid = this.getMapUID();
    const jsgeoda = this.getJsGeoDa();
    const oldLayerData = this.getTopLayerData();

    const values = getDataByFieldName(oldLayerData.data, varName);
    const nb = jsgeoda.custom_breaks(map_uid, selectedMethod, k, null, values);
    const colors = colorbrewer[colorName][k].map(hex => hexToRgb(hex));

    const returnFillColor = (obj, index) => {
      const x = obj.properties[varName];
      for (var i = 1; i < nb.breaks.length; ++i) {
        if (x < nb.breaks[i]) return colors[i - 1];
      }
      return [255, 255, 255];
    };

    // used to trigger legend update: adding colorLegends
    // { "rgba()" : "label1"}
    var colorLegends = {};
    for (let i = 0; i < k; ++i) {
      const hex = colorbrewer[colorName][k][i];
      const clr = hexToRgbStr(hex);
      const lbl = this.printRange(nb.breaks[i], nb.breaks[i + 1]);
      colorLegends[clr] = lbl;
    }

    var oldLayer = this.getTopLayer();

    var newConfig = {
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
    this.props.dispatch(wrapTo(mapID, layerConfigChange(oldLayer, newConfig)));
  };

  render() {
    return (
      <div style={this.getButtonStyle()}>
        <img
          className="GeoDa-Button"
          src={this.props.src}
          alt={this.props.tooltip}
          onClick={this.handleClickOpen}
        />
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            <FormattedMessage id={'geoda.map.createThemeMap'} />
          </DialogTitle>
          <DialogContent dividers>
            <VariableSelect
              ref={ref => (this._variableSelect = ref)}
              fields={this.getFields()}
              fieldType={['integer', 'real']}
            />
            <MapTypeSelect ref={ref => (this._mapTypeSelect = ref)} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.createThemeMap} color="primary">
              <FormattedMessage id={'geoda.map.createMap'} />
            </Button>
            <Button autoFocus onClick={this.handleClose} color="primary">
              <FormattedMessage id={'geoda.close'} />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
