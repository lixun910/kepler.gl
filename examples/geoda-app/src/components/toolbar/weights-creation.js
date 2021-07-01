import React from 'react';
import {Dialog, Box, Button, TextField, Typography, Grid} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';

import {DialogTitle, DialogContent, DialogActions} from '../modal-dlg';
import DefaultButton from './default-button';
import WeightsTabs from './weights-tabs';

export default class WeightsCreation extends DefaultButton {
  // create a spatial weights
  createWeights = event => {
    event.preventDefault();

    const conf = this._weightsTabs.getWeightsCreationConfig();
    const jsgeoda = this.getJsGeoDa();
    const map_uid = this.getMapUID();
    let w = null;

    if (conf.WeightsType === 'contiguity') {
      const order = conf.contiguity.Order;
      const includeLowerOrder = conf.contiguity.IncludeLowerOrder;
      const precisionThreshold = conf.contiguity.PrecisionThresholdValue;

      if (conf.contiguity.ContiguityType === 'rook') {
        w = jsgeoda.CreateRookWeights(map_uid, order, includeLowerOrder, precisionThreshold);
      } else {
        w = jsgeoda.CreateQueenWeights(map_uid, order, includeLowerOrder, precisionThreshold);
      }
    } else if (conf.WeightsType === 'distance') {
      // placeholder
      // not implemented yet
    }

    const weightsUniqueId = w.get_uid();
    // console.log(weightsUniqueId);

    // save to global store
    const n = Object.keys(this.props.demo.geoda.weights[map_uid]).length;
    this.props.demo.geoda.weights[map_uid][weightsUniqueId] = {
      idx: n,
      uid: weightsUniqueId,
      name: this.state.weightsName,
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

    // update UI
    this.props.onCloseClick();
  };

  state = {
    open: this.props.isOpen, // overwrite parent class
    weightsName: ''
  };

  weightsNameChange = event => {
    this.setState({
      open: this.state.open,
      weightsName: event.target.value
    });
  }

  render() {
    this.state.open = this.props.isOpen;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="weights-creation-dialog" open={this.state.open}>
        <DialogTitle id="weights-creation-dialog-title" onClose={this.props.onCloseClick}>
          <FormattedMessage id={'geoda.weights.createWeightsDlg'} />
        </DialogTitle>
        <form autoComplete="off" onSubmit={this.createWeights} >
          <DialogContent dividers>
            <Grid container mt={4} spacing={1} justify="center" alignItems="flex-end">
              <Grid item xs={4}>
                <Typography>
                  <FormattedMessage id={'geoda.weights.inputWeightsName'} />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField autoFocus required label="required"
                  fullWidth margin="dense" id="weightsName" type="string"
                  onChange={this.weightsNameChange}
                />
              </Grid>
            </Grid>
            <Box m={4} />
            <WeightsTabs ref={(ref) => this._weightsTabs = ref} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus type="submit" color="primary">
              <FormattedMessage id={'geoda.weights.create'} />
            </Button>
            <Button autoFocus onClick={this.props.onCloseClick} color="primary">
              <FormattedMessage id={'geoda.close'} />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}
