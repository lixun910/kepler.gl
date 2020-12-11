import React, { useState }  from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

// import action and forward dispatcher
import {wrapTo, layerConfigChange} from 'kepler.gl/actions';
import {getDataByFieldName} from '../utils'

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

const COLOR_SCALE = {
  'natural_breaks':[
    [240, 240, 240],
    // positive
    [255, 255, 204],
    [255, 237, 160],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38],
  ],
};


export default class GeoDaMapButton extends React.Component {
  // this.props
  floatLeftStyle = {
      margin: '10px',
      display: 'inline-block',
      width: '36px',
      height: '36px'
  };

  mapID = this.props.mapID;

  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  createThemeMap = () => {
    // send layerConfigChange action to kepler
    // 0 means always apply on the top layer
    const map_uid = this.props.geoda.map_uid;
    const jsgeoda = this.props.geoda.jsgeoda;
    const values = getDataByFieldName(this.props.keplerGl[this.mapID].visState.layerData[0].data, 'Crm_prn');
    const nb = jsgeoda.natural_breaks(map_uid, 6, values);
    const selectedMethod = "natural_breaks";

    const returnFillColor = (obj) => {
      let x = obj.properties['Crm_prn'];
      if (x ==0) {
        return COLOR_SCALE[selectedMethod][0];
      }
      for (var i = 1; i < nb.breaks.length; ++i) {
        if (x < nb.breaks[i])
          return COLOR_SCALE[selectedMethod][i];
      }
      return [255,255,255];
    };

    var oldLayer = this.props.keplerGl[this.mapID].visState.layers[0];
    var newConfig = {
        color: [0,255,0],  // color is not used but triggering map to redraw
        layerData: {
          getFillColor: returnFillColor
        }
    };
    this.props.dispatch(wrapTo(this.mapID, layerConfigChange(oldLayer, newConfig)));
  };

  render() {
      return (
          <div style={this.floatLeftStyle}>
              <img className="GeoDa-Button"
                  src={this.props.src}
                  alt={this.props.tooltip}
                  onClick={this.handleClickOpen}
              />
              <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
                <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                  Modal title
                </DialogTitle>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                    in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                  </Typography>
                  <Typography gutterBottom>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                    lacus vel augue laoreet rutrum faucibus dolor auctor.
                  </Typography>
                  <Typography gutterBottom>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                    scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                    auctor fringilla.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={this.handleClose} color="primary">
                    Save changes
                  </Button>
                </DialogActions>
              </Dialog>
          </div>
      );
  }
}
