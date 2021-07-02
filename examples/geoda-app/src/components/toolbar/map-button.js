import React  from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {FormattedMessage} from 'react-intl';
import {wrapTo, layerConfigChange} from 'kepler.gl/actions';

import {createChroplethMap} from '../../actions';
import {getDataByFieldName} from '../../utils';
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
  createThemeMap = () => {
    // send layerConfigChange action to kepler
    // 0 means always apply on the top layer
    const mapID = this.getMapId();
    const oldLayerData = this.getTopLayerData();
    const varName = this._variableSelect.getSelected();
    const selectedMethod = this._mapTypeSelect.getMapType();
    const oldLayer = this.getTopLayer();

    const themeConf = {
      varName,
      k: this._mapTypeSelect.getCategoryNumber(),
      selectedMethod,
      colorName: COLOR_NAME[selectedMethod],
      mapUid: this.getMapUID(),
      jsgeoda: this.getJsGeoDa(),
      values: getDataByFieldName(oldLayerData.data, varName),
      oldLayer
    };

    const newConfig = createChroplethMap(themeConf);
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
