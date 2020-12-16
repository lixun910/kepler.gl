import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import Person from '@material-ui/icons/Person';
import ListItemText from '@material-ui/core/ListItemText';

import {FieldTokenFactory, appInjector} from 'kepler.gl/components';
import {ALL_FIELD_TYPES} from 'kepler.gl/constants';
const FieldToken = appInjector.get(FieldTokenFactory);

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default class VariableSelect extends React.Component {
  // props: fields from kepler.gl;
  // props: filedTyp ['integer', 'real','string']

  state = {selected: ''};

  getSelected = ()=> {
    return this.state.selected;
  };

  getSelectedtype = ()=> {
    return this.state.selected;
  };

  handleChange = (event) => {
    this.setState({
      selected: event.target.value
    });
  };

  fieldOptions = this.props.fields.map((item,index)=>{
    if (this.props.fieldType.includes(item.type)) {
      let itemType = ALL_FIELD_TYPES.integer;
      if (item.type == "integer") {
        itemType = ALL_FIELD_TYPES.integer;
      } else if (item.type == "real") {
        itemType = ALL_FIELD_TYPES.real;
      }
      return (
        <MenuItem key={index} value={item.name}
          selected={index==0}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FieldToken type={itemType}/>
            <Box ml={1}>
              <ListItemText primary={item.name} />
            </Box>
          </div>
        </MenuItem>
      )
    }
  })

  render() {

    return (
      <Box mt={1}>
        <InputLabel id="variable-select-label">Select a variable</InputLabel>
        <Box mt={1}>
          <Select
            labelId="variable-select-label"
            id="variable-select"
            label="Select a variable"
            value={this.state.selected}
            onChange={this.handleChange}
            variant="filled"
            margin="dense"
            fullWidth
          >
            {this.fieldOptions}
          </Select>
        </Box>
      </Box>
    );
  }
}
