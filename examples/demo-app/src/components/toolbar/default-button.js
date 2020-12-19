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
    if (this.props.enabled) {
      this.setState({ open: true });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  getMapId = () => {
    return this.props.demo.geoda.mapID;
  }

  getMapUID = () => {
    return this.props.enabled ? this.props.demo.geoda.currentMapUid : '';
  }

  getJsGeoDa = () => {
    return this.props.enabled ? this.props.demo.geoda.jsgeoda : null;
  }

  getTopLayerIndex = () => {
    if (!this.props.enabled) {
      return 0;
    }
    const mapId = this.getMapId();
    return this.props.demo.keplerGl[mapId].visState.layerOrder[0];
  };

  getTopLayerData = () => {
    if (!this.props.enabled) {
      return null;
    }
    const mapId = this.getMapId();
    const topLayer = this.getTopLayerIndex();
    return this.props.demo.keplerGl[mapId].visState.layerData[topLayer];
  };

  getTopLayer = () => {
    if (!this.props.enabled) {
      return null;
    }
    const mapId = this.getMapId();
    const topLayer = this.getTopLayerIndex();
    return this.props.demo.keplerGl[mapId].visState.layers[topLayer];
  };

  getFields = () => {
    if (!this.props.enabled) {
      return [];
    }
    const currentMapUId = this.getMapUID();
    return this.props.demo.geoda.fields[currentMapUId];
  }

  getWeights = () => {
    if (!this.props.enabled) {
      return [];
    }
    const currentMapUId = this.getMapUID();
    let result = [];
    if (currentMapUId in this.props.demo.geoda.weights) {
      const weights = this.props.demo.geoda.weights[currentMapUId];
      // weightsUniqueId : { idx: 0, name: weightsName, type, numObs, isSymmetric, density, sparsity
      // maxNbrs, minNbrs, medianNbrs, meanNbrs}
      const n = Object.keys(weights).length;
      for (let i=0; i<n; ++i) result.push({});
      for (const wuid in weights) {
        const w= weights[wuid];
        result[w.idx] = w;
      }
    }
    return result;
  }
}
