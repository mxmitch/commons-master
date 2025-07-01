import React from 'react';
import BillCard from './BillCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function Bills({ bills, user, setUser, updateWatchList, categories, filters }) {
  // Identify selected category object if one is selected
  const selectedCategory =
    filters.category !== '0'
      ? categories.find((cat) => cat.uclassify_class === filters.category)
      : null;

  // Frontend filtering based on first assigned category only
  const filteredBills = bills.filter((bill) => {
    if (!bill) return false;
  
    const assigned = bill.assigned_categories || [];
    const matchesCategory =
      filters.category === '0' ||
      (assigned.length > 0 && assigned[0] === filters.category);
  
    const billChamber = bill.bill_number?.startsWith('S-')
      ? 'senate'
      : bill.bill_number?.startsWith('C-')
      ? 'commons'
      : null;
  
    const matchesChamber =
      filters.senateHouse === '' || filters.senateHouse === billChamber;
  
    return matchesCategory && matchesChamber;
  });

  if (!filteredBills || filteredBills.length === 0) {
    return <div>No bills available for this filter.</div>;
  }

  const billCards = filteredBills.map((bill) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={bill.id}>
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
