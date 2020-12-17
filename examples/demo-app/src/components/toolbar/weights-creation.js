import React  from 'react';
import {Dialog, Box, Button, TextField, Typography,Grid} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';

import {DialogTitle, DialogContent, DialogActions} from '../modal-dlg';
import DefaultButton from './default-button';
import WeightsTabs from './weights-tabs';

export default class WeightsCreation extends React.Component{

  createWeights = () => {
    const conf = this._weightsTabs.getWeightsCreationConfig();
    const jsgeoda = this.getJsGeoDa();
    const map_uid = this.getMapUID();

    if (conf.WeightsType == 'contiguity') {
      const order = conf.contiguity.Order;
      const includeLowerOrder = conf.contiguity.IncludeLowerOrder;
      const precisionThreshold = conf.contiguity.PrecisionThresholdValue;
      let w = null;

      if (conf.contiguity.ContiguityType == 'rook') {
        w = jsgeoda.CreateRookWeights(map_uid, order, includeLowerOrder, precisionThreshold);
      } else {
        w = jsgeoda.CreateQueenWeights(map_uid, order, includeLowerOrder, precisionThreshold);
      }

      const weightsUniqueId = w.get_uid();
      console.log(weightsUniqueId);
      // save to global store
      this.props.demo.geoda.weights[map_uid].append(weightsUniqueId);
    }
  };

  state = {
    open: this.props.isOpen, // overwrite parent class
    weightsName : ''
  }

  weightsNameChange = (event) => {
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
        <DialogContent dividers>
          <Grid container mt={4} spacing={1} justify="center" alignItems="center">
            <Grid item xs={4}>
              <Typography>
                <FormattedMessage id={'geoda.weights.inputWeightsName'} />
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField autoFocus required fullWidth margin="dense" id="weightsName" type="string"
                onChange={this.weightsNameChange}
              />
            </Grid>
          </Grid>
          <Box m={4} />
          <WeightsTabs ref={(ref) => this._weightsTabs = ref} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.createWeights} color="primary">
            <FormattedMessage id={'geoda.weights.create'} />
          </Button>
          <Button autoFocus onClick={this.props.onCloseClick} color="primary">
            <FormattedMessage id={'geoda.close'} />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
