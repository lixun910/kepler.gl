import React, {Component} from 'react';
import {connect} from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {IntlProvider, FormattedMessage, FormattedNumber} from 'react-intl';
import {createSelector} from 'reselect';

import KeplerGl from 'kepler.gl';

import GeoDaToolbar from './components/toolbar';
import {messages} from './constants/localization'

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

    mapID = this.props.geoda.mapID;

    localeMessagesSelector = createSelector(
      props => pmessages,
      customMessages => (customMessages ? mergeMessages(messages, customMessages) : messages)
    );

    localeMessages = (locale) => messages[locale];

    render() {
      return (
        <div style={{position: 'absolute', width: '100%', height: '100%'}}>
          <IntlProvider locale={this.props.geoda.locale} messages={this.localeMessages(this.props.geoda.locale)} defaultLocale="en">
            <GeoDaToolbar dispatch={this.props.dispatch} mapID={this.mapID} keplerGl={this.props.keplerGl} geoda={this.props.geoda} />
          </IntlProvider>
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
