import React, { useState } from 'react';
import BillCard from './BillCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function Bills({ bills, user, setUser, updateWatchList, categories, filters }) {
  // Find the category name corresponding to the selected category ID (if not 0)
  const selectedCategory = filters?.category !== 0
    ? categories.find(cat => cat.id === filters.category)
    : null;
  console.log('Selected Category after filter change:', selectedCategory);

  // Log filters to ensure it's correctly passed and updated
  console.log('Applied Filters:', filters);

  // Filter bills based on selected category and additional filters
  const filteredBills = bills.filter((bill) => {
    if (!bill) return false;

    // Category filter
    const matchesCategory =
      filters.category === 0 ||
      (selectedCategory &&
        bill.assigned_categories &&
        bill.assigned_categories[0] === selectedCategory.uclassify_class);

    // Determine if the bill is passed based on the presence of received_royal_assent_date
    const isPassed = bill.received_royal_assent_date !== null;

    // If the filter status is "passed", check if the bill is passed
    // If the filter status is anything else, check if the bill is active
    const matchesStatus = filters?.status === 'passed' ? isPassed : !isPassed;

    // Session filter
    const matchesSession = filters.session ? bill.parl_session_code === filters.session : true;

    // Chamber filter
    const billChamber = bill.bill_number && typeof bill.bill_number === 'string'
      ? bill.bill_number.includes('S-') ? 'Senate' : 'Commons'
      : null;
    const matchesChamber = filters?.senateHouse
      ? billChamber.toLowerCase() === filters.senateHouse.toLowerCase()
      : true;

    // Date filter
    const billDate = bill.passed_senate_first_reading_date || bill.passed_house_first_reading_date;
    const matchesDate = filters.date ? new Date(billDate) >= new Date(filters.date) : true;

    return matchesCategory && matchesStatus && matchesSession && matchesChamber && matchesDate;
  });

  // Log the filtered results
  console.log('Filtered Bills:', filteredBills);

  if (filteredBills.length === 0) {
    return <div>No bills available for this filter.</div>;
  }

  // Map through filtered bills and create BillCards
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
