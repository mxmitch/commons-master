import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Box, Grid } from '@mui/material';

export default function Filter({ categories = [], filters, setFilters, applyFilters, onReset }) {
    // Local state to hold form selections until "Apply" is clicked
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters); // update localFilters if props.filters change externally (like on reset)
    }, [filters]);

    const handleChange = (field) => (event) => {
        setLocalFilters((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleApply = () => {
        setFilters(localFilters);     // update parent state
        applyFilters(localFilters);   // pass fresh filters directly
      };

    const handleReset = () => {
        if (onReset) onReset();
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                    <TextField
                        select
                        label="Select Category"
                        value={localFilters.category}
                        onChange={handleChange('category')}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="0">View All Bills</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.uclassify_class}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6} md={4}>
                    <TextField
                        select
                        label="Select Status"
                        value={localFilters.status}
                        onChange={handleChange('status')}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="passed">Passed</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6} md={4}>
                    <TextField
                        select
                        label="Senate or Commons"
                        value={localFilters.senateHouse}
                        onChange={handleChange('senateHouse')}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="senate">Senate</MenuItem>
                        <MenuItem value="commons">House of Commons</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
                <Button variant="contained" onClick={handleApply}>Apply Filters</Button>
                <Button variant="outlined" onClick={handleReset}>Reset Filters</Button>
            </Box>
        </div>
    );
}
