import React  from 'react';
import {
  Dialog, Box, Button,  Typography,Grid,
  FormControlLabel, Checkbox
} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';

import {DialogTitle, DialogContent, DialogActions} from '../modal-dlg';
import DefaultButton from './default-button';
import {WeightsList, WeightsMetaTable} from './weights-manager';
import WeightsCreation from './weights-creation';

export default class GeoDaWeightsButton extends DefaultButton {

  constructor(props) {
    super(props);
    this.state = {
      open: false, // overwrite parent class
      checked : [],
      isCreateOpen: false
    };
  }

  handleToggle = (value) => () => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      open: this.state.open,
      checked: newChecked
    });
  };

  getCreateOpenStatus = () => {
    return this.state.isCreateOpen;
  };

  onCreateClick = () =>  {
    // create weights dialog
    this.state.isCreateOpen = true;
    this.state.open = false;
    this.setState(this.state);
  };

  onCreateClose = () => {
    this.state.isCreateOpen = false;
    this.state.open = true;
    this.setState(this.state);
  }

  render() {
    const divStyle = this.getButtonStyle();
      return (
          <div style={divStyle} >
              <img className="GeoDa-Button"
                  src={this.props.src}
                  alt={this.props.tooltip}
                  onClick={this.handleClickOpen}
              />
              <WeightsCreation isOpen={this.state.isCreateOpen} onCloseClick={this.onCreateClose} />
              <Dialog onClose={this.handleClose} aria-labelledby="weights-manager-dialog" open={this.state.open}>
                <DialogTitle id="weights-manager-dialog-title" onClose={this.handleClose}>
                  <FormattedMessage id={'geoda.weights.managerDialog'} />
                </DialogTitle>
                <DialogContent dividers>
                <Grid container spacing={1} justify="center" alignItems="center">
                  <Grid container spacing={1} justify="center" alignItems="center">
                    <Grid item>
                      <Button  variant="contained" color="primary" onClick={this.onCreateClick}>
                        <FormattedMessage id={'geoda.weights.create'} />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button  variant="contained" color="primary">Save</Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="primary">Remove</Button>
                    </Grid>
                  </Grid>
                  <Grid container style={{ margin: '10px'}} justify="center" alignItems="center">
                    <Grid item xs={10}><WeightsList /></Grid>
                  </Grid>
                  <Grid container spacing={1} justify="center" alignItems="center">
                    <Grid item xs={1}></Grid>
                    <Grid item xs={3}>
                      <Button size="small" variant="contained">Intersection</Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button size="small" variant="contained">Union</Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button size="small" variant="contained">Make Symmetric</Button>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={false}
                            name="mutualCheck"
                            color="primary"
                          />
                        }
                        label="mutual"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Grid container  style={{ margin: '10px'}}  spacing={1} justify="center" alignItems="center">
                    <Grid item xs={10}><WeightsMetaTable /> </Grid>
                  </Grid>
                  <Grid container spacing={1} justify="center" alignItems="center">
                    <Grid item>
                      <Button  variant="contained" color="default">Histogram</Button>
                    </Grid>
                    <Grid item>
                      <Button  variant="contained" color="default">Connectivity Map</Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="default">Connectivity Graph</Button>
                    </Grid>
                  </Grid>
                </Grid>
                </DialogContent>
              </Dialog>

          </div>
      );
  }
}
