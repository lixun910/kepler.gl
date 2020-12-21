import React  from 'react';
import { Divider, Popover, MenuList, MenuItem} from '@material-ui/core';

import DefaultButton from './default-button';
import LocalMoranDialog from './sa-localmoran';

export function SimpleMenu(props) {

  const [anchorEl, setAnchorEl] = React.useState(props.anchorEl);

  const handleClose = (event) => {
    // let parent handle the click
    const id = event.target.id;
    props.handleMenuClick(id);
  };

  return (
    <div>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorEl={props.anchorEl}
        open={props.isOpen}
        onClose={handleClose}
      >
        <MenuList>
          <MenuItem id="UNI_LOCAL_MORAN" onClick={handleClose}>Univariate Local Moran's I</MenuItem>
          <MenuItem disabled onClick={handleClose}>Univariate Median Local Moran's I</MenuItem>
          <Divider />
          <MenuItem disabled onClick={handleClose}>Local G</MenuItem>
          <MenuItem disabled onClick={handleClose}>Local G*</MenuItem>
          <Divider />
          <MenuItem disabled onClick={handleClose}>Univariate Local Join Count</MenuItem>
          <MenuItem disabled onClick={handleClose}>Bivariate Local Join Count</MenuItem>
          <MenuItem disabled onClick={handleClose}>Co-location Local Join Count</MenuItem>
          <Divider />
          <MenuItem disabled onClick={handleClose}>Univariate Local Geary</MenuItem>
          <MenuItem disabled onClick={handleClose}>Multivariate Local Geary</MenuItem>
          <Divider />
          <MenuItem disabled onClick={handleClose}>Univariate Quantile LISA</MenuItem>
          <MenuItem disabled onClick={handleClose}>Multivariate Quantile LISA</MenuItem>
          <Divider />
          <MenuItem disabled onClick={handleClose}>Local Neighbor Match Test</MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
}

export default class GeoDaSAButton extends DefaultButton {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
      isMenuOpen: false,
      uniLocalMoran: false
    };
  }

  handleClickButton = (event)=> {
    if (this.props.enabled) {
      this.state.anchorEl = event.currentTarget;
      this.state.isMenuOpen = true;
      this.setState(this.state);
    }
  };

  handleMenuClick = (id) => {
    // handle menu
    if (id == "UNI_LOCAL_MORAN") {
      this.state.uniLocalMoran = true;
    }
    // update menu statue
    this.state.anchorEl = null;
    this.state.isMenuOpen = false;
    this.setState(this.state);
  };

  closeDialog =(id) => {
    if (id == "UNI_LOCAL_MORAN") {
      this.state.uniLocalMoran = false;
    }
    this.setState(this.state);
  }

  render() {
    return (
      <div style={this.getButtonStyle()}>
        <img className="GeoDa-Button"
            src={this.props.src}
            alt={this.props.tooltip}
            onClick={this.handleClickButton}
        />
        <SimpleMenu
          isOpen={this.state.isMenuOpen}
          anchorEl={this.state.anchorEl}
          handleMenuClick={this.handleMenuClick} />
        <LocalMoranDialog
          open={this.state.uniLocalMoran} {...this.props}
          close={this.closeDialog}/>
      </div>
    );
  }
}
