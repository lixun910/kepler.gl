import React from 'react';
import {Dialog, Box, Button, TextField, Typography, Grid} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';

import {DialogTitle, DialogContent, DialogActions} from '../modal-dlg';
import DefaultButton from './default-button';
import WeightsTabs from './weights-tabs';
import {weightsCreationAction} from '../../actions';

export default class WeightsCreation extends DefaultButton {
  state = {
    open: this.props.isOpen, // overwrite parent class
    weightsName: ''
  };

  // create a spatial weights
  createWeights = event => {
    event.preventDefault();

    const conf = this._weightsTabs.getWeightsCreationConfig();
    conf.weightsName = this.state.weightsName;

    this.props.dispatch(weightsCreationAction(conf));
  };

  weightsNameChange = event => {
    this.setState({
      open: this.state.open,
      weightsName: event.target.value
    });
  };

  render() {
    this.state.open = this.props.isOpen;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="weights-creation-dialog"
        open={this.state.open}
      >
        <DialogTitle id="weights-creation-dialog-title" onClose={this.props.onCloseClick}>
          <FormattedMessage id={'geoda.weights.createWeightsDlg'} />
        </DialogTitle>
        <form autoComplete="off" onSubmit={this.createWeights}>
          <DialogContent dividers>
            <Grid container mt={4} spacing={1} justify="center" alignItems="flex-end">
              <Grid item xs={4}>
                <Typography>
                  <FormattedMessage id={'geoda.weights.inputWeightsName'} />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  required
                  label="required"
                  fullWidth
                  margin="dense"
                  id="weightsName"
                  type="string"
                  onChange={this.weightsNameChange}
                />
              </Grid>
            </Grid>
            <Box m={4} />
            <WeightsTabs ref={ref => (this._weightsTabs = ref)} />
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
