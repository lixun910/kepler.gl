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
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import MapTwoToneIcon from '@material-ui/icons/MapTwoTone';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import {FormattedMessage} from 'react-intl'

// import action and forward dispatcher
import {wrapTo, layerConfigChange} from 'kepler.gl/actions';
import {getDataByFieldName, colorbrewer, hexToRgb} from '../utils'

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
    padding: theme.spacing(2),
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

  state = {
    open: false,
    checked: null,
    category: 6
  };

  mapTypes = {
    "Quantile" : "quantile_breaks",
    "Percentile" : "percentile_breaks",
    "Box Map (Hinge=1.5)" : "hinge15_breaks",
    "Box Map (Hinge=3.0)": "hinge30_breaks",
    "Standard Deviation": "stddev_breaks",
    "Natural Breaks" : "natural_breaks",
    "Equal Intervals" : "equalinterval_breaks"
  };

  mapFixedBins = ["Box Map (Hinge=1.5)", "Box Map (Hinge=3.0)", "Standard Deviation"];

  selectMap = null;

  handleClickOpen = () => {
    this.setState({
      open: true,
      checked: null,
      category: "6"
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
    const selectedMethod = this.mapTypes[this.state.checked];
    const k = parseInt(this.state.category);
    const nb = jsgeoda.custom_breaks(map_uid, selectedMethod, k, null, values);
    const colors = colorbrewer['YlOrBr'][k].map((hex)=>hexToRgb(hex));

    const returnFillColor = (obj) => {
      let x = obj.properties['Crm_prn'];
      for (var i = 1; i < nb.breaks.length; ++i) {
        if (x < nb.breaks[i])
          return colors[i-1];
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

  handleListItemClick = (mapType) => {
    this.selectMap = mapType;
    this.setState({
      open: true,
      checked: mapType,
      category: this.mapFixedBins.includes(mapType)? "6": this.state.category
    });
  };

  isChecked = (mapType) => {
    return mapType == this.selectMap;
  };

  textFieldChange = (event) => {
    this.setState({
      open: true,
      checked: this.state.checked,
      category: event.target.value,
    });
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
                  <FormattedMessage id={'selectMapType'} />
                </DialogTitle>
                <DialogContent dividers>
                <List>
                {Object.keys(this.mapTypes).map((mapType) => (
                  <ListItem button onClick={() => this.handleListItemClick(mapType)} key={mapType}>
                    <ListItemAvatar>
                      <Avatar>
                        <MapTwoToneIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={mapType} />
                    <ListItemSecondaryAction>
                      <Checkbox edge="end" disabled checked={this.state.checked==mapType} />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                </List>
                <TextField
                  autoFocus
                  required
                  disabled={this.mapFixedBins.includes(this.state.checked)}
                  margin="dense"
                  id="number_categories"
                  label="Number of Categories"
                  type="number"
                  //defaultValue="6"
                  value={this.state.category}
                  onChange={this.textFieldChange}
                  variant="filled"
                  helperText="Some important textSome important textSome important textSome important textSome important textSome important text"
                  fullWidth
                />
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
