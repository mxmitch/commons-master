import React, { useState } from 'react';
import { TextField, MenuItem, Button } from '@mui/material';

export default function Filter(props) {
  const [category, setCategory] = useState(0);
  const [status, setStatus] = useState('');
  const [session, setSession] = useState('');
  const [senateHouse, setSenateHouse] = useState('');

  // Ensure categories are passed and available
  const categories = props.categories || [];

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    value: c.id,
    label: c.name,
  }));

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSessionChange = (event) => {
    setSession(event.target.value);
  };

  const handleSenateHouseChange = (event) => {
    setSenateHouse(event.target.value);
  };

  const handleApplyFilters = async () => {
    const newFilters = {
      category,
      status,
      session,
      senateHouse,
    };
    console.log('Applying Filters:', newFilters); // Log the filters being applied
    await props.applyFilters(newFilters);
  };

  return (
    <div>
      <TextField
        select
        label="Select Category"
        value={category}
        onChange={handleCategoryChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value={0}>View All Bills</MenuItem>
        {categoryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Select Status"
        value={status}
        onChange={handleStatusChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="passed">Passed</MenuItem>
      </TextField>

      <TextField
        select
        label="Select Session"
        value={session}
        onChange={handleSessionChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="44-1">Parliament 44, Session 1</MenuItem>
        <MenuItem value="44-2">Parliament 44, Session 2</MenuItem>
      </TextField>

      <TextField
        select
        label="Senate or Commons"
        value={senateHouse}
        onChange={handleSenateHouseChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="senate">Senate</MenuItem>
        <MenuItem value="commons">House of Commons</MenuItem>
      </TextField>

      <Button onClick={handleApplyFilters}>Apply Filters</Button>
    </div>
  );
}

