import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ccc',
    maxHeight: 200,
    height: 150,
    position: 'relative',
    overflow: 'auto'
  },
  item: {
    paddingTop: 0
  }
}));

export function WeightsList(props) {
  const weightsItems = props.weightsItems;
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List className={classes.root}>
      {weightsItems.map((w, idx) => {
        const labelId = `checkbox-list-label-${idx}`;

        return (
          <ListItem
            key={idx}
            role={undefined}
            dense
            button
            onClick={handleToggle(idx)}
            classes={{root: classes.item}}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(idx) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{'aria-labelledby': labelId}}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={w.name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="Description">
                <DescriptionIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

const tableStyles = makeStyles({
  table: {
    width: '100%',
    maxHeight: 300,
    height: 200,
    position: 'relative',
    overflow: 'auto'
  }
});

export function WeightsMetaTable(props) {
  const weightsMeta = props.weightsMeta;
  const classes = tableStyles();

  const metaList = [
    'type',
    'isSymmetric',
    'numObs',
    'minNbrs',
    'maxNbrs',
    'meanNbrs',
    'medianNbrs',
    'sparsity',
    'density'
  ];

  const metaNames = [
    'type',
    'symmetric',
    '# observations',
    'min neighbors',
    'max neighbors',
    'mean neighbors',
    'median neighbors',
    '% non-zero',
    'density'
  ];

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table stickyHeader aria-label="weights-meta-table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell style={{backgroundColor: 'yellowgreen'}}>Property</TableCell>
            <TableCell style={{backgroundColor: 'yellowgreen'}}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metaList.map((meta, idx) => {
            return (
              <TableRow key={meta}>
                <TableCell component="th" scope="row">
                  {metaNames[idx]}
                </TableCell>
                <TableCell>{weightsMeta ? weightsMeta[meta] : ''}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
