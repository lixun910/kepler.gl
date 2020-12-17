import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import DescriptionIcon from '@material-ui/icons/Description';
import {
  TableContainer,Table,TableHead,TableRow, TableCell, TableBody, Paper
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ccc',
    maxHeight: 200,
    height: 150,
    position: 'relative',
    overflow: 'auto',
  },
  item: {
    paddingTop: 0
  }
}));

export function WeightsList() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
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
      {[0, 1, 2, 3,4,5,6,7,8].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)} classes={{ root: classes.item}}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
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
    overflow: 'auto',
  },
});

const rows = [
  {name: 'Frozen yoghurt1', 'calories': 159},
  {name: 'Frozen yoghurt2', 'calories': 159},
  {name: 'Frozen yoghurt3', 'calories': 159},
  {name: 'Frozen yoghurt4', 'calories': 159},
  {name: 'Frozen yoghurt5', 'calories': 159},
];

export function WeightsMetaTable() {
  const classes = tableStyles();

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table stickyHeader aria-label="simple table" size="medium" >
        <TableHead >
          <TableRow >
            <TableCell style={{backgroundColor: 'yellowgreen'}}>Dessert (100g serving)</TableCell>
            <TableCell style={{backgroundColor: 'yellowgreen'}}>Calories</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.calories}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
