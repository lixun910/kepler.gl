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

import GeoDaMapButton from './toolbar/map-button';
import GeoDaWeightsButton from './toolbar/map-button';
import {openFileDialog} from '../actions';

// import action and forward dispatcher
import {showDatasetTable, wrapTo} from 'kepler.gl/actions';

class GeoDaButton extends React.Component {

    getButtonStyle = () => {
      return {
        margin: '5px',
        display: 'inline-block',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        filter: this.props.enabled ? '' : 'grayscale(100%)'
    }};

    render() {
        return (
            <div style={this.getButtonStyle()}>
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
        height: '60px',
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

    loaded = this.props.geoda.loaded;

    handlerGeoDaInfo = () => {
    };
    handlerGeoDaOpen = () => { this.props.dispatch(wrapTo(this.mapID, openFileDialog())); };
    handlerGeoDaClose = () => {this.props.dispatch(wrapTo(this.mapID, openFileDialog())); };
    handlerGeoDaSave = () => {this.props.dispatch(wrapTo(this.mapID, openFileDialog())); };
    handlerGeoDaTable = () => {
        // this.props.visStateActions.loadFiles(fileList);
        const dataId = this.props.keplerGl[this.mapID].visState.layers[0].config.dataId;
        //this.props.dispatch(wrapTo(this.mapID, showTable(dataId)));
        this.props.dispatch(wrapTo(this.mapID, showDatasetTable(dataId)));
    };

    render() {
        return (
            <Draggable>
            <div style={this.toolbarStyle}>
              <div style={this.innerStyle}>
                <Grid container alignItems="center">
                <GeoDaButton key="0" src="./img/geoda.png" tooltip="GeoDa" enabled={true} handler={this.handlerGeoDaInfo} />
                <Divider key="-1" orientation="vertical" flexItem />
                <GeoDaButton key="1" src="./img/open.png" tooltip="Open" enabled={true} handler={this.handlerGeoDaOpen} />
                <GeoDaButton key="2" src="./img/close.png" tooltip="Close" enabled={false} handler={this.handlerGeoDaClose} />
                <GeoDaButton key="3" src="./img/save.png" tooltip="Save" enabled={false} handler={this.handlerGeoDaSave} />
                <Divider key="-2" orientation="vertical" flexItem />
                <GeoDaButton key="4" src="./img/table.png" tooltip="Table" enabled={this.props.geoda.loaded} handler={this.handlerGeoDaTable} />
                <GeoDaWeightsButton key="5" src="./img/weights.png" tooltip="Weights" enabled={this.props.geoda.loaded} {...this.props}  />
                <Divider key="-3" orientation="vertical" flexItem />
                <GeoDaMapButton key="6" src="./img/classify.png" tooltip="Maps and Rates" enabled={this.props.geoda.loaded} {...this.props} />
                <GeoDaButton key="7" src="./img/cartogram.png" tooltip="Cartogram" enabled={false} handler={this.handlerGeoDaTable} />
                <GeoDaButton key="8" src="./img/animation.png" tooltip="Animation" enabled={false} handler={this.handlerGeoDaTable} />
                <Divider key="-4" orientation="vertical" flexItem />
                <GeoDaButton key="9" src="./img/histogram.png" tooltip="Histogram" enabled={false} handler={this.handlerGeoDaTable} />
                <GeoDaButton key="10" src="./img/boxplot.png" tooltip="Box plot" enabled={false} handler={this.handlerGeoDaTable} />
                <GeoDaButton key="11" src="./img/scatterplot.png" tooltip="Scatter" enabled={false} handler={this.handlerGeoDaTable} />
                <GeoDaButton key="12" src="./img/scattermatrix.png" tooltip="Scatter Matrix" enabled={false} handler={this.handlerGeoDaTable} />
                <GeoDaButton key="13" src="./img/pcp.png" tooltip="Parallel Coordinate" enabled={false} handler={this.handlerGeoDaTable} />
                <Divider key="-5" orientation="vertical" flexItem />
                <GeoDaButton key="14" src="./img/clustering.png" tooltip="Clustering" enabled={false} handler={this.handlerGeoDaTable} />
                <Divider key="-6" orientation="vertical" flexItem />
                <GeoDaButton key="15" src="./img/moranscatter.png" tooltip="Moran Scatter" enabled={false} handler={this.handlerGeoDaTable} />
                <GeoDaButton key="16" src="./img/sa.png" tooltip="Spatial Autocorrelation" enabled={false} handler={this.handlerGeoDaTable} />
                </Grid>
              </div>
            </div>
            </Draggable>
        );
    }
}
