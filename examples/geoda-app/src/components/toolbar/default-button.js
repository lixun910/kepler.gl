import React  from 'react';

export default class DefaultButton extends React.Component {
  getButtonStyle = () => {
    return {
      margin: '5px',
      display: 'inline-block',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      filter: this.props.enabled ? '' : 'grayscale(100%)'
  }};

  state = { open: false };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  getMapId = () => this.props.mapID;

  getMapUID = () => this.props.geoda.map_uid;

  getJsGeoDa = () => this.props.geoda.jsgeoda;

  getTopLayerIndex = () => {
    const mapId = this.getMapId();
    return this.props.keplerGl[mapId].visState.layerOrder[0];
  };

  getTopLayerData = () => {
    const mapId = this.getMapId();
    const topLayer = this.getTopLayerIndex();
    return this.props.keplerGl[mapId].visState.layerData[topLayer];
  };

  getTopLayer = () => {
    const mapId = this.getMapId();
    const topLayer = this.getTopLayerIndex();
    return this.props.keplerGl[mapId].visState.layers[topLayer];
  };
}
