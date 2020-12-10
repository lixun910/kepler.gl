import React from 'react';
import {sortableContainer, sortableElement} from 'react-sortable-hoc';
import classnames from 'classnames';
import {createSelector} from 'reselect';
import get from 'lodash.get';
import styled from 'styled-components';
import {Button, PanelLabel, LayerPanel, CustomPanelsFactory, Icons, SidePanelDivider, SidePanelSection} from 'kepler.gl/components';

const StyledFilterPanel = styled.div`
  margin-bottom: 12px;
  border-radius: 1px;
`;

// make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style
const SortableStyledItem = styled.div`
  z-index: ${props => props.theme.dropdownWrapperZ + 1};

  &.sorting {
    pointer-events: none;
  }

  &.sorting-layers .layer-panel__header {
    background-color: ${props => props.theme.panelBackgroundHover};
    font-family: ${props => props.theme.fontFamily};
    font-weight: ${props => props.theme.fontWeight};
    font-size: ${props => props.theme.fontSize};
    line-height: ${props => props.theme.lineHeight};
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    .layer__drag-handle {
      opacity: 1;
      color: ${props => props.theme.textColorHl};
    }
  }
`;

function GeoDaSidePanelsFactory() {

  
  const CustomPanels = props => {
    if (props.activeSidePanel === 'geoda') {

      const layers = props.layers;

      /* selectors */
      const SortableItem = sortableElement(({children, isSorting}) => {
        return (
          <SortableStyledItem className={classnames('sortable-layer-items', {sorting: isSorting})}>
            {children}
          </SortableStyledItem>
        );
      });
    
      const SortableContainer = sortableContainer(({children}) => {
        return <div>{children}</div>;
      });

      const layerOrder = [0];

      const state = {
        isSorting: false
      };

      // src/components/side-panel.js line 307  add datasets
      // layers[0].config.color []
      // layers[0].dataToFeatures: Array[3085] geometry, properties
      /*
      <StyledFilterPanel className="filter-panel">
          <FilterFilterComponent allAvailableFields={allAvailableFields} {...this.props} />
        </StyledFilterPanel>
      analyzerType: "INT"
format: ""
id: "REGIONS"
name: "REGIONS"
tableFieldIndex: 2
type: "integer"
*/
      return (
        <div className="geoda-panel">
          <SidePanelDivider />
          <SidePanelSection>
            <SortableContainer
              //onSortEnd={this._handleSort}
              //onSortStart={this._onSortStart}
              //updateBeforeSortStart={this._updateBeforeSortStart}
              lockAxis="y"
              helperClass="sorting-layers"
              useDragHandle
            >
              {layerOrder.map(
                (layerIdx, index) =>
                  !layers[layerIdx].config.hidden && (
                    <SortableItem
                      key={`layer-${layerIdx}`}
                      index={index}
                      isSorting={state.isSorting}
                    >
                      {layerIdx}
                      
                    </SortableItem>
                  )
              )}
            </SortableContainer>
          </SidePanelSection>
        </div>
      );
    } 
    return null;
  };

  CustomPanels.defaultProps = {
    panels: [
      {
        id: 'geoda',
        label: 'GeoDa',
        iconComponent: Icons.LineChart
      },
    ],
    getProps: props => ({
      layers: props.layers
    })
  };

  return CustomPanels;
}

export default GeoDaSidePanelsFactory;
