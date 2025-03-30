import React from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      width: '100%',
      textAlign: 'left',
      marginBottom: '16px',
      marginTop: '16px'
    }
  },
  text: {
    margin: '0 auto'
  }
}));

export default function CategoryDropdown(props) {
  const classes = useStyles();
  const [category, setCategory] = React.useState(0);

  const categories = [];
  props.categories.forEach((c) => {
    categories.push({
      id: c.id,
      value: c.id,
      label: c.name
    });
  });

  const handleChange = (event) => {
    const category = event.target.value;
    setCategory(category);
    props.passCategory(category);
  };

  return (
    <form className={classes.root} noValidate autoComplete='off'>
      <div>
        <TextField
          id='standard-select-currency'
          select
          label='Select'
          value={category}
          onChange={handleChange}
          helperText='Please select a category'
        >
          <MenuItem key={0} value={0}>
            {'View All Bills'}
          </MenuItem>
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </form>
  );
}
