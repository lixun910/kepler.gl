import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ContiguityTabPanel from './weights-contiguity-tab';
import DistanceTabPanel from './weights-distance-tab';

export default class WeightsTabs extends React.Component {
  state = {value: 0};

  contiguityConfig = {
    ContiguityType: 'queen',
    Order: 1,
    IncludeLowerOrder: false,
    UsePrecisionThreshold: false,
    PrecisionThresholdValue: 0
  };

  distanceConfig = {};

  getWeightsCreationConfig = () => {
    return {
      WeightsType: this.state.value === 0 ? 'contiguity' : 'distance',
      contiguity: this.contiguityConfig,
      distance: this.distanceConfig
    };
  };

  handleContiguityUpdate = config => {
    this.contiguityConfig = config;
  };

  handleChange = (event, newValue) => {
    this.setState({value: newValue});
  };

  render() {
    return (
      <div style={{flexGrow: 1}}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Contiguity Weight" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
          <Tab label="Distance Weight" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
        </Tabs>
        <ContiguityTabPanel
          value={this.state.value}
          index={0}
          updater={this.handleContiguityUpdate}
        />
        <DistanceTabPanel value={this.state.value} index={1} />
      </div>
    );
  }
}
