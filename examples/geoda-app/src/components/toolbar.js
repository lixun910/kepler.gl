// Author: lixun910@gmail.com

//  ---------------------------------
//  |   []   []   []  []   []  |  [] |
//  ---------------------------------
//
// <GeoDaToolbar>
//  <GeoDaButton name="" src="" tooltip=""/>
//  <GeoDaButton name="" src="" tooltip=""/>
// </GeoDaToolbar>

import React from 'react';
import Draggable from 'react-draggable';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import GeoDaMapButton from './map-button';
import {hideAndShowSidePanel, openFileDialog, showGeoDaInfo, classifyMap} from '../actions/actions';

// import action and forward dispatcher
import {showDatasetTable, wrapTo, layerConfigChange} from 'kepler.gl/actions';

class GeoDaButton extends React.Component {
    // this.props
    floatLeftStyle = {
        margin: '5px',
        display: 'inline-block',
        width: '36px',
        height: '36px'
    };

    render() {
        return (
            <div style={this.floatLeftStyle}>
                <img className="GeoDa-Button"
                    src={this.props.src}
                    alt={this.props.tooltip}
                    onClick={this.props.handler}
                />
            </div>
        );
    }
}

const COLOR_SCALE = {
  'natural_breaks':[
    [240, 240, 240],
    // positive
    [255, 255, 204],
    [255, 237, 160],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38],
  ],
};

export default class GeoDaToolbar extends React.Component {
    toolbarStyle = {
        borderRadius: '10px',
        position: 'absolute',
        top: '10px',
        left: '50%',
        marginLeft : '-400px',
        zIndex: '100',
        width: '800px',
        height: '50px',
        padding: '10px 0px 0px 10px',
        backgroundColor: '#eee',
        backgroundImage: 'linear-gradient(#eee, #ccc)',
        boxShadow: "5px 5px 20px black",
    };

    innerStyle = {
        height: '100%',
        whiteSpace: 'nowrap'
    };

    mapID = this.props.mapID;

    handlerGeoDaInfo = () => {
        //this.props.dispatch(wrapTo(this.mapID, showGeoDaInfo()));
        this.props.dispatch(showGeoDaInfo());
    };
    handlerGeoDaOpen = () => { this.props.dispatch(wrapTo(this.mapID, openFileDialog())); };
    handlerGeoDaClose = () => {this.props.dispatch(wrapTo(this.mapID, openFileDialog())); };
    handlerGeoDaSave = () => {this.props.dispatch(wrapTo(this.mapID, hideAndShowSidePanel())); };
    handlerGeoDaTable = () => {
        // this.props.visStateActions.loadFiles(fileList);
        const dataId = this.props.keplerGl[this.mapID].visState.layers[0].config.dataId;
        //this.props.dispatch(wrapTo(this.mapID, showTable(dataId)));
        this.props.dispatch(wrapTo(this.mapID, showDatasetTable(dataId)));
    };

    getDataByFieldName = (rawData, fieldName) => {
      let values = [];
      for (const feat of rawData) {
        values.push(feat.properties[fieldName]);
      }
      return values;
    };

    handlerGeoDaMap = () => {
        // send layerConfigChange action to kepler
        // 0 means always apply on the top layer
        const map_uid = this.props.geoda.map_uid;
        const jsgeoda = this.props.geoda.jsgeoda;
        const values = this.getDataByFieldName(this.props.keplerGl[this.mapID].visState.layerData[0].data, 'Crm_prn');
        const nb = jsgeoda.natural_breaks(map_uid, 6, values);
        const selectedMethod = "natural_breaks";

        const returnFillColor = (obj) => {
          let x = obj.properties['Crm_prn'];
          if (x ==0) {
            return COLOR_SCALE[selectedMethod][0];
          }
          for (var i = 1; i < nb.breaks.length; ++i) {
            if (x < nb.breaks[i])
              return COLOR_SCALE[selectedMethod][i];
          }
          return [255,255,255];
        };

        var oldLayer = this.props.keplerGl[this.mapID].visState.layers[0];
        var newConfig = {
            color: [0,255,0],  // color is not used but triggering map to redraw
            layerData: {
              getFillColor: returnFillColor
            }
        };
        this.props.dispatch(wrapTo(this.mapID, layerConfigChange(oldLayer, newConfig)));
    };

    render() {
        return (
            <Draggable>
            <div style={this.toolbarStyle}>
              <div style={this.innerStyle}>
                <Grid container alignItems="center">
                <GeoDaButton key="0" src="./img/geoda.png" tooltip="GeoDa" handler={this.handlerGeoDaInfo} />
                <Divider key="-1" orientation="vertical" flexItem />
                <GeoDaButton key="1" src="./img/open.png" tooltip="Open" handler={this.handlerGeoDaOpen} />
                <GeoDaButton key="2" src="./img/close.png" tooltip="Close" handler={this.handlerGeoDaClose} />
                <GeoDaButton key="3" src="./img/save.png" tooltip="Save" handler={this.handlerGeoDaSave} />
                <Divider key="-2" orientation="vertical" flexItem />
                <GeoDaButton key="4" src="./img/table.png" tooltip="Table" handler={this.handlerGeoDaTable} />
                <GeoDaButton key="5" src="./img/weights.png" tooltip="Weights" handler={this.handlerGeoDaTable} />
                <Divider key="-3" orientation="vertical" flexItem />
                <GeoDaMapButton key="6" src="./img/classify.png" tooltip="Maps and Rates" {...this.props} />
                <GeoDaButton key="7" src="./img/cartogram.png" tooltip="Cartogram" handler={this.handlerGeoDaTable} />
                <GeoDaButton key="8" src="./img/animation.png" tooltip="Animation" handler={this.handlerGeoDaTable} />
                <Divider key="-4" orientation="vertical" flexItem />
                <GeoDaButton key="9" src="./img/histogram.png" tooltip="Histogram" handler={this.handlerGeoDaTable} />
                <GeoDaButton key="10" src="./img/boxplot.png" tooltip="Box plot" handler={this.handlerGeoDaTable} />
                <GeoDaButton key="11" src="./img/scatterplot.png" tooltip="Scatter" handler={this.handlerGeoDaTable} />
                <GeoDaButton key="12" src="./img/scattermatrix.png" tooltip="Scatter Matrix" handler={this.handlerGeoDaTable} />
                <GeoDaButton key="13" src="./img/pcp.png" tooltip="Parallel Coordinate" handler={this.handlerGeoDaTable} />
                <Divider key="-5" orientation="vertical" flexItem />
                <GeoDaButton key="14" src="./img/clustering.png" tooltip="Clustering" handler={this.handlerGeoDaTable} />
                <Divider key="-6" orientation="vertical" flexItem />
                <GeoDaButton key="15" src="./img/moranscatter.png" tooltip="Moran Scatter" handler={this.handlerGeoDaTable} />
                <GeoDaButton key="16" src="./img/sa.png" tooltip="Spatial Autocorrelation" handler={this.handlerGeoDaTable} />
                </Grid>
              </div>
            </div>
            </Draggable>
        );
    }
}
