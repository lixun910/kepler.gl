import React from 'react';

import {
  InputLabel,
  Box,
  withStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox
} from '@material-ui/core';

import {FieldTokenFactory, appInjector} from 'kepler.gl/components';
import {ALL_FIELD_TYPES} from 'kepler.gl/constants';

const FieldToken = appInjector.get(FieldTokenFactory);

const useStyles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ccc',
    maxHeight: 200,
    height: 150,
    position: 'relative',
    overflow: 'auto'
  },
  item: {
    paddingTop: 0
  }
});

class VariableSelect extends React.Component {
  // props: fields from kepler.gl;
  // props: filedTyp ['integer', 'real','string']

  state = {field: '', selected: 1};

  getSelected = () => {
    return this.state.field;
  };

  getSelectedtype = () => {
    return this.state.field;
  };

  handleChange = (index, itemName) => {
    // this.state.field = itemName;
    // this.state.selected = index;
    this.setState({...this.state, field: itemName, selected: index});
  };

  render() {
    const {classes} = this.props;

    return (
      <Box mt={1}>
        <InputLabel id="variable-select-label">Select a variable</InputLabel>
        <Box mt={1}>
          <List className={classes.root}>
            {this.props.fields.map((item, index) => {
              if (this.props.fieldType.includes(item.type)) {
                let itemType = ALL_FIELD_TYPES.integer;
                if (item.type === 'integer') {
                  itemType = ALL_FIELD_TYPES.integer;
                } else if (item.type === 'real') {
                  itemType = ALL_FIELD_TYPES.real;
                }
                const labelId = `field-checkbox-${index}`;
                const selected = index === this.state.selected;
                return (
                  <ListItem
                    button
                    key={index}
                    selected={selected}
                    onClick={event => this.handleChange(index, item.name)}
                  >
                    <ListItemIcon>
                      <FieldToken type={itemType} />
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    <ListItemSecondaryAction>
                      {!selected ? (
                        ''
                      ) : (
                        <Checkbox
                          edge="end"
                          onChange={event => this.handleChange(index, item.name)}
                          checked={selected}
                          inputProps={{'aria-labelledby': labelId}}
                        />
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              }
            })}
          </List>
        </Box>
      </Box>
    );
  }
}

export default withStyles(useStyles)(VariableSelect);
