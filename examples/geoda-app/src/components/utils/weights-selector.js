import React from 'react';
import {Box, Select, ListItemIcon, ListItemText, MenuItem, InputLabel} from '@material-ui/core';

export default class WeightsSelect extends React.Component {
  state = {selected: ''};

  componentDidMount = () => {
    if (this.state.selected === '') {
      if (this.props.weightsItems.length > 0) {
        // this.state.selected = 0;
        this.setState({...this.state, selected: 0});
      }
    }
  };

  getSelected = () => {
    return this.props.weightsItems[this.state.selected];
  };

  handleChange = event => {
    this.setState({
      selected: event.target.value
    });
  };

  render() {
    return (
      <Box mt={1}>
        <InputLabel id="weights-select-label">Select a spatial weights:</InputLabel>
        <Box mt={1}>
          <Select
            required
            labelId="weights-select-label"
            id="weights-select"
            label="Spatial Weights"
            value={this.state.selected}
            onChange={this.handleChange}
            variant="filled"
            margin="dense"
            fullWidth
          >
            {this.props.weightsItems.map((w, index) => {
              return (
                <MenuItem key={index} value={index}>
                  <ListItemIcon>Q</ListItemIcon>
                  <ListItemText primary={w.name} />
                </MenuItem>
              );
            })}
          </Select>
        </Box>
      </Box>
    );
  }
}
