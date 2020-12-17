import React  from 'react';

export default class DefaultButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  getButtonStyle = () => {
    return {
      margin: '5px',
      display: 'inline-block',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      filter: this.props.enabled ? '' : 'grayscale(100%)'
  }};

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  getMapId = () => this.props.demo.geoda.mapID;

  getMapUID = () => this.props.demo.geoda.currentMapUid;

  getJsGeoDa = () => this.props.demo.geoda.jsgeoda;

  getTopLayerIndex = () => {
    const mapId = this.getMapId();
    return this.props.demo.keplerGl[mapId].visState.layerOrder[0];
  };

  getTopLayerData = () => {
    const mapId = this.getMapId();
    const topLayer = this.getTopLayerIndex();
    return this.props.demo.keplerGl[mapId].visState.layerData[topLayer];
  };

  getTopLayer = () => {
    const mapId = this.getMapId();
    const topLayer = this.getTopLayerIndex();
    return this.props.demo.keplerGl[mapId].visState.layers[topLayer];
  };

  getFields = () => {
    const currentMapUId = this.getMapUID();
    return this.props.demo.geoda.fields[currentMapUId];
  }
}
