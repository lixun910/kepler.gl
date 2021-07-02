import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {FormattedMessage} from 'react-intl';
import {wrapTo, layerConfigChange} from 'kepler.gl/actions';

import {getDataByFieldName} from '../../utils';
import VariableSelect from '../utils/field-selector';
import WeightsSelect from '../utils/weights-selector';
import {DialogTitle, DialogContent, DialogActions} from '../modal-dlg';
import DefaultButton from './default-button';
import {createLocalMoranMap} from '../../actions';

export default class LocalMoranDialog extends DefaultButton {
  onOKClick = event => {
    event.preventDefault();

    const mapID = this.getMapId();
    const oldLayerData = this.getTopLayerData();
    const varName = this._variableSelect.getSelected();
    const oldLayer = this.getTopLayer();

    const moranConf = {
      varName,
      wuid: this._weightsSelect.getSelected().uid,
      mapUid: this.getMapUID(),
      jsgeoda: this.getJsGeoDa(),
      values: getDataByFieldName(oldLayerData.data, varName),
      oldLayer
    };

    const newConfig = createLocalMoranMap(moranConf);
    this.props.dispatch(wrapTo(mapID, layerConfigChange(oldLayer, newConfig)));
  };

  handleClose = () => {
    this.props.close('UNI_LOCAL_MORAN');
  };

  render() {
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="localmoran-dialog" open={this.props.open}>
        <DialogTitle id="localmoran-dialog-title" onClose={this.handleClose}>
          <FormattedMessage id={'geoda.sa.unilocalmoran'} />
        </DialogTitle>
        <form autoComplete="off" onSubmit={this.onOKClick}>
          <DialogContent dividers>
            <VariableSelect
              ref={ref => (this._variableSelect = ref)}
              fields={this.getFields()}
              fieldType={['integer', 'real']}
            />
            <WeightsSelect
              ref={ref => (this._weightsSelect = ref)}
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
