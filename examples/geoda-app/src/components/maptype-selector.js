import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import MapTwoToneIcon from '@material-ui/icons/Map';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';

import {FormattedMessage} from 'react-intl';

import {FieldTokenFactory, appInjector} from 'kepler.gl/components';
import {ALL_FIELD_TYPES} from 'kepler.gl/constants';
const FieldToken = appInjector.get(FieldTokenFactory);

const mapTypes = {
  "Quantile" : "quantile_breaks",
  "Percentile" : "percentile_breaks",
  "Box Map (Hinge=1.5)" : "hinge15_breaks",
  "Box Map (Hinge=3.0)": "hinge30_breaks",
  "Standard Deviation": "stddev_breaks",
  "Natural Breaks" : "natural_breaks",
  "Equal Intervals" : "equalinterval_breaks"
};

const mapFixedBins = [
  "Box Map (Hinge=1.5)",
  "Box Map (Hinge=3.0)",
  "Standard Deviation"
];

export default class MapTypeSelect extends React.Component {
  //classes = useStyles();

  state = {
    mapType: '',
    category: '6'
  };

  getMapType= ()=> {
    return mapTypes[this.state.mapType];
  };

  getCategoryNumber= ()=> {
    return parseInt(this.state.category);
  };

  mapTypeChange = (event) => {
    const selectMapType = event.target.value;
    const k = mapFixedBins.includes(selectMapType) ? '6' : this.state.category;

    this.setState({
      mapType: selectMapType,
      category: k
    });
  };

  categoryChange = (event) => {
    this.setState({
      ...this.state,
      category : event.target.value
    });
  };

  fieldOptions = Object.keys(mapTypes).map((mapType,index)=>{
    return (
      <MenuItem key={index} value={mapType}>
          <ListItemIcon><MapTwoToneIcon/></ListItemIcon>
          <ListItemText primary={mapType} />
      </MenuItem>
    )
  })

  render() {

    return (
      <Box mt={1}>
        <InputLabel id="maptype-select-label">
          Select a classification method:
        </InputLabel>
        <Box mt={1}>
          <Select
            labelId="map-select-label"
            id="map-select"
            value={this.state.mapType}
            onChange={this.mapTypeChange}
            variant="filled"
            margin="dense"
            fullWidth
          >
            {this.fieldOptions}
          </Select>
        </Box>
        <Box mt={1}>
          <InputLabel id="variable-category-label">
            Number of Categories
          </InputLabel>
          <TextField
            autoFocus
            required
            disabled={mapFixedBins.includes(this.state.mapType)}
            margin="dense"
            id="number_categories"
            label=""
            type="number"
            value={this.state.category}
            onChange={this.categoryChange}
            variant="filled"
            helperText=""
            fullWidth
          />
        </Box>
      </Box>
    );
  }
}
