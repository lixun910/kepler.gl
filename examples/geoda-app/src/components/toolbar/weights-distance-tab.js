import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default class DistanceTabPanel extends React.Component {
  render() {
    return (
      <div
        role="tabpanel"
        hidden={this.props.value !== this.props.index}
        id={`simple-tabpanel-${this.props.index}`}
        aria-labelledby={`simple-tab-${this.props.index}`}
      >
        {this.props.value === this.props.index && (
          <Box p={3}>
            <Typography>bbb</Typography>
          </Box>
        )}
      </div>
    );
  };
}

DistanceTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};
