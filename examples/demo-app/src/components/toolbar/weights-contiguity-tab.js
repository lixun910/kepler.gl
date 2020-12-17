import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import {
  Radio, RadioGroup, Grid, FormControlLabel, Typography, TextField, Checkbox,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function ContiguityTabPanel(props) {
  const classes = useStyles();

  const { children, value, index, updater, ...other } = props;

  const [contiguityType, setContiguityType] = React.useState('queen');

  const contiguityTypeChange = (event) => {
    setContiguityType(event.target.value);
    updater(getConfiguration('ContiguityType', event.target.value));
  };

  const [orderValue, setOrderValue] = React.useState(1);

  const orderValueChange = (event) => {
    let v = parseInt(event.target.value);
    setOrderValue(v);
    updater(getConfiguration('Order', v));
  };

  const [includeLowerOrder, setIncludeLowerOrder] = React.useState(false);

  const includeLowerOrderChange = (event) => {
    setIncludeLowerOrder(event.target.checked);
    updater(getConfiguration('IncludeLowerOrder', event.target.checked));
  }

  const [precision, setPrecision] = React.useState(false);

  const precisionChange = (event) => {
    setPrecision(event.target.checked);
    updater(getConfiguration('UsePrecisionThreshold', event.target.checked));
  }

  const [thresholdValue, setThresholdValue] = React.useState(0);

  const thresholdValueChange = (event) => {
    let v = parseFloat(event.target.value);
    setThresholdValue(v);
    updater(getConfiguration('PrecisionThresholdValue', v));
  }

  const getConfiguration = (k,v) => {
    let conf = {
      ContiguityType: contiguityType,
      Order: orderValue,
      IncludeLowerOrder: includeLowerOrder,
      UsePrecisionThreshold: precision,
      PrecisionThresholdValue: thresholdValue
    };
    conf[k] = v;
    return conf;
  }

  return (
    <div className={classes.root}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <RadioGroup aria-label="contiguityType" name="contiguityType" value={contiguityType} onChange={contiguityTypeChange}>
          <Grid container mt={4} spacing={1} justify="center" alignItems="center">
            <Grid container item xs={12} spacing={1} justify="center" alignItems="center">
              <Grid item xs={6}>
                <FormControlLabel value="queen" control={<Radio />} label="Queen Contiguity" />
              </Grid>
              <Grid item xs={4}>
                <Typography><FormattedMessage id={'geoda.weights.ordercontiguity'} /></Typography>
              </Grid>
              <Grid item xs={2}>
                <TextField autoFocus required margin="dense" id="order" type="number"
                  value={orderValue}
                  onChange={orderValueChange}
                  InputProps={{ inputProps: {min: 1} }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={1} justify="center" alignItems="center">
              <Grid item xs={6}>
                <FormControlLabel value="rook" control={<Radio />} label="Rook Contiguity" />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeLowerOrder}
                      onChange={includeLowerOrderChange}
                      name="checkedLO"
                      color="primary"
                      disabled={orderValue<=1}
                    />
                  }
                  label="include lower orders"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={1} justify="center" alignItems="center">
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={precision}
                      onChange={precisionChange}
                      name="checkedPrecision"
                      color="primary"
                    />
                  }
                  label="Precision threshold:"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField disabled={!precision} margin="dense" id="threshold" value={thresholdValue} onChange={thresholdValueChange} />
              </Grid>
            </Grid>
          </Grid>
        </RadioGroup>
      )}
    </div>
  );
}

ContiguityTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
