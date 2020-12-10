import React, {Component} from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {createAction} from 'redux-actions';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled from 'styled-components'

//import KeplerGl from 'kepler.gl';
import {showDatasetTable, wrapTo, toggleModal, forwardTo} from 'kepler.gl/actions';
import {SidebarFactory, CustomPanelsFactory, injectComponents} from 'kepler.gl/components';

import GeoDaSidePanelFactory from './components/geoda-panel';
import {showModal, openFileDialog, hideAndShowSidePanel} from './actions/actions';
import GeoDaToolbar from './components/toolbar';

// Mapbox
const MAPBOX_TOKEN = "pk.eyJ1IjoibGl4dW45MTAiLCJhIjoiY2locXMxcWFqMDAwenQ0bTFhaTZmbnRwaiJ9.VRNeNnyb96Eo-CorkJmIqg";

// Inject custom components; comment import KeplerGl from 'kepler.gl'
const KeplerGl = injectComponents([
  [CustomPanelsFactory, GeoDaSidePanelFactory]
]);

// Main App
class App extends Component {
    componentDidMount() {
        // action after component mount
        //this.props.dispatch(wrapTo('map1', addDataToMap({datasets: sampleData,config})));
        //this.props.dispatch(toggleModal(null))
    }

    mapID = "map1";

    _toggleSidePanelVisibility = () => {
      this.props.dispatch(wrapTo(this.mapID, hideAndShowSidePanel()));
    };

    _showTable = () => {
      const dataId = this.props.keplerGl[this.mapID].visState.layers[0].config.dataId;
      this.props.dispatch(wrapTo(this.mapID, showDatasetTable(dataId)));
    };
    //<button onClick={this._showTable}> Show Table</button>
    render() {
      const { geoda: {modal} } = this.props;

      return (
        <div style={{position: 'absolute', width: '100%', height: '100%'}}>
          <GeoDaToolbar dispatch={this.props.dispatch} mapID={this.mapID} keplerGl={this.props.keplerGl} geoda={this.props.geoda} />
          <AutoSizer>
            {({height, width}) => (
              <KeplerGl mapboxApiAccessToken={MAPBOX_TOKEN} id={this.mapID} width={width} height={height} />
            )}
          </AutoSizer>
        </div>
      );
    }

    _closeModal = () => {
      this.props.dispatch(showModal(null));
    };

    _openModal = id => {
      this.props.dispatch(showModal(id));
    };

  }


  const mapStateToProps = state => state;
  const dispatchToProps = (dispatch, props) => ({
    dispatch,
    keplerGlDispatch: forwardTo('map1', dispatch)
  });

  export default connect(mapStateToProps, dispatchToProps)(App);
