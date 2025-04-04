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

  // Ensure categories are passed and available
  const categories = props.categories || [];

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    value: c.id,
    label: c.name,
  }));

  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    props.passCategory(selectedCategory);
  };

  return (
    <form className={classes.root} noValidate autoComplete='off'>
      <div>
        <TextField
          id='standard-select-currency'
          select
          label='Select Category'
          value={category}
          onChange={handleChange}
          helperText='Please select a category'
        >
          {/* Default option to show all bills */}
          <MenuItem key={0} value={0}>
            {'View All Bills'}
          </MenuItem>
          {/* Map through the categories */}
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </form>
  );
}
