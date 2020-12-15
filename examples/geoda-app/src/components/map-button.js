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

import {FormattedMessage} from 'react-intl';

// import action and forward dispatcher
import {wrapTo, layerConfigChange} from 'kepler.gl/actions';


import {getDataByFieldName, colorbrewer, hexToRgb, hexToRgbStr} from '../utils'
import VariableSelect from './field-selector';
import MapTypeSelect from './maptype-selector';

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2),
    width: '400px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
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
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const COLOR_NAME = {
  'natural_breaks': 'YlOrBr',
  'quantile_breaks': 'YlOrBr'
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

  state = { open: false };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  createThemeMap = () => {
    // send layerConfigChange action to kepler
    // 0 means always apply on the top layer
    const varName = this._variableSelect.getSelected();
    const k = this._mapTypeSelect.getCategoryNumber();
    const selectedMethod = this._mapTypeSelect.getMapType();

    const map_uid = this.props.geoda.map_uid;
    const jsgeoda = this.props.geoda.jsgeoda;

    const topLayer = this.props.keplerGl[this.mapID].visState.layerOrder[0];

    const values = getDataByFieldName(this.props.keplerGl[this.mapID].visState.layerData[topLayer].data, varName);
    const nb = jsgeoda.custom_breaks(map_uid, selectedMethod, k, null, values);
    const colors = colorbrewer['YlOrBr'][k].map((hex)=>hexToRgb(hex));

    const returnFillColor = (obj) => {
      let x = obj.properties[varName];
      for (var i = 1; i < nb.breaks.length; ++i) {
        if (x < nb.breaks[i])
          return colors[i-1];
      }
      return [255,255,255];
    };

    // used to trigger legend update: adding colorLegends
    // { "rgba()" : "label1"}
    var colorLegends = {};
    for (let i=0; i<k; ++i) {
      let hex = colorbrewer['YlOrBr'][k][i];
      let clr = hexToRgbStr(hex);
      let lbl = '' + nb.breaks[i];
      colorLegends[clr] = lbl;
    }

    var oldLayer = this.props.keplerGl[this.mapID].visState.layers[topLayer];
    const oldLayerData = this.props.keplerGl[this.mapID].visState.layerData[topLayer];
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
            colors: colorbrewer['YlOrBr'][k],
            colorLegends: colorLegends,
            colorMap: null // avoid getColorScale() to overwrite custom color
          }
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
                  <FormattedMessage id={'createThemeMap'} />
                </DialogTitle>
                <DialogContent dividers>

                <VariableSelect
                  ref={(ref) => this._variableSelect = ref}
                  fields={this.props.geoda.fields}
                  fieldType={['integer', 'real']} />

                <MapTypeSelect ref={(ref) => this._mapTypeSelect = ref} />
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={this.createThemeMap} color="primary">
                    <FormattedMessage id={'createMap'} />
                  </Button>
                  <Button autoFocus onClick={this.handleClose} color="primary">
                    <FormattedMessage id={'close'} />
                  </Button>
                </DialogActions>
              </Dialog>
          </div>
      );
  }
}
