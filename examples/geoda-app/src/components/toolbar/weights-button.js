import React from 'react';
import {Dialog, Button, Grid, FormControlLabel, Checkbox} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';

import {DialogTitle, DialogContent} from '../modal-dlg';
import DefaultButton from './default-button';
import {WeightsList, WeightsMetaTable} from './weights-manager';
import WeightsCreation from './weights-creation';

export default class GeoDaWeightsButton extends DefaultButton {
  constructor(props) {
    super(props);
    this.state = {
      open: false, // overwrite parent class
      checked: [],
      isCreateOpen: false,
      weights: props.demo.geoda.weights
    };
  }

  handleToggle = value => () => {
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

  onCreateClick = () => {
    // create weights dialog
    this.state.isCreateOpen = true;
    this.state.open = false;
    this.setState(this.state);
  };

  onCreateClose = () => {
    this.state.isCreateOpen = false;
    this.state.open = true;
    this.setState(this.state);
  };

  render() {
    const divStyle = this.getButtonStyle();
    const weightsItems = this.getWeights();
    return (
      <div style={divStyle}>
        <img
          className="GeoDa-Button"
          src={this.props.src}
          alt={this.props.tooltip}
          onClick={this.handleClickOpen}
        />
        <WeightsCreation
          isOpen={this.state.isCreateOpen}
          onCloseClick={this.onCreateClose}
          {...this.props}
        />
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="weights-manager-dialog"
          open={this.state.open}
        >
          <DialogTitle id="weights-manager-dialog-title" onClose={this.handleClose}>
            <FormattedMessage id={'geoda.weights.managerDialog'} />
          </DialogTitle>
          <DialogContent style={{width: '450px'}} dividers>
            <Grid container spacing={1} justify="center" alignItems="center">
              <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={this.onCreateClick}>
                    <FormattedMessage id={'geoda.weights.create'} />
                  </Button>
                </Grid>
                <Grid item>
                  <Button disabled variant="contained" color="primary">
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Button disabled variant="contained" color="primary">
                    Remove
                  </Button>
                </Grid>
              </Grid>
              <Grid container style={{margin: '10px'}} justify="center" alignItems="center">
                <Grid item xs={12}>
                  <WeightsList weightsItems={weightsItems} />
                </Grid>
              </Grid>
              <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item xs={1} />
                <Grid item xs={'auto'}>
                  <Button disabled size="small" variant="contained">
                    Intersection
                  </Button>
                </Grid>
                <Grid item xs={'auto'}>
                  <Button disabled size="small" variant="contained">
                    Union
                  </Button>
                </Grid>
                <Grid item xs={'auto'}>
                  <Button disabled size="small" variant="contained">
                    Make Symmetric
                  </Button>
                </Grid>
                <Grid item xs={'auto'}>
                  <FormControlLabel
                    control={
                      <Checkbox disabled checked={false} name="mutualCheck" color="primary" />
                    }
                    label="mutual"
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{margin: '10px'}}
                spacing={1}
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <WeightsMetaTable weightsMeta={weightsItems[0]} />{' '}
                </Grid>
              </Grid>
              <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item>
                  <Button disabled variant="contained" color="default">
                    Histogram
                  </Button>
                </Grid>
                <Grid item>
                  <Button disabled variant="contained" color="default">
                    Connectivity Map
                  </Button>
                </Grid>
                <Grid item>
                  <Button disabled variant="contained" color="default">
                    Connectivity Graph
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
