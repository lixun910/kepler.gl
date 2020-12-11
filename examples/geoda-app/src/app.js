import React, {Component} from 'react';
import {connect} from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import KeplerGl from 'kepler.gl';

import GeoDaToolbar from './components/toolbar';

// Mapbox
const MAPBOX_TOKEN = "pk.eyJ1IjoibGl4dW45MTAiLCJhIjoiY2locXMxcWFqMDAwenQ0bTFhaTZmbnRwaiJ9.VRNeNnyb96Eo-CorkJmIqg";

// Inject custom components; comment import KeplerGl from 'kepler.gl'
//const KeplerGl = injectComponents([[CustomPanelsFactory, GeoDaSidePanelFactory]]);

// Main App
class App extends Component {
    componentDidMount() {
        // action after component mount
        //this.props.dispatch(wrapTo('map1', addDataToMap({datasets: sampleData,config})));
    }

    mapID = "map1";

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
  }


  const mapStateToProps = state => state;
  const dispatchToProps = dispatch => ({dispatch});

  export default connect(mapStateToProps, dispatchToProps)(App);
