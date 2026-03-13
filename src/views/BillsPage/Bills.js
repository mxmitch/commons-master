import React from 'react';
import BillCard from './BillCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function Bills({ bills, user, setUser, updateWatchList }) {
  const validBills = (bills || []).filter(Boolean);

  if (validBills.length === 0) {
    return <div>No bills available for this filter.</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} alignItems="stretch">
        {validBills.map((bill) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={bill.bill_number}>
            <BillCard
              user={user}
              bill={bill}
              setUser={setUser}
              updateWatchList={updateWatchList}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
