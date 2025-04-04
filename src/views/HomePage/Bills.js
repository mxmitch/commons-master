import React from 'react';
import BillCard from './BillCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function Bills({ bills, childCategory, user, setUser, updateWatchList, categories }) {
  // Debugging: Check what childCategory is
  console.log("Selected Category ID:", childCategory);

  // Find the category name corresponding to the selected category ID (if not 0)
  const selectedCategory = childCategory !== 0
    ? categories.find(cat => cat.id === childCategory)
    : null;

  // Debugging: Log the selected category
  console.log("Selected Category:", selectedCategory);

  // If childCategory is 0 (View All Bills), return all bills
  const filteredBills = bills.filter((bill) => {
    // If childCategory is 0, show all bills
    if (childCategory === 0) {
      return true;
    }

    // Otherwise, check if the bill's categories include the selected category's name
    if (selectedCategory) {
      return bill.assigned_categories?.includes(selectedCategory.uclassify_class);
    }

    return false; // If no valid selectedCategory exists
  });

  // If no bills match the filter, return a message
  if (filteredBills.length === 0) {
    return <div>No bills available for this category.</div>;
  }

  // Map through filtered bills and create BillCards
  const billCards = filteredBills.map((bill) => (
    <Grid item xs={12} sm={6} md={3} lg={3} key={bill.id}>
      <BillCard
        user={user}
        bill={bill}
        setUser={setUser}
        updateWatchList={updateWatchList}
      />
    </Grid>
  ));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} alignItems="stretch">
        {billCards}
      </Grid>
    </Box>
  );
}
