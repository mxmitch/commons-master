import React from 'react';
import BillCard from './BillCard';

export default function Bills({ bills, childCategory, user, setUser, updateWatchList }) {
  // Filter bills based on selected category
  const filteredBills = bills.filter((bill) => {
    return childCategory === 0 ? bill : bill.categories.includes(childCategory);
  });

  // If no bills match the filter, return a message
  if (filteredBills.length === 0) {
    return <div>No bills available for this category.</div>;
  }

  // Map through filtered bills and create BillCards
  const billCards = filteredBills.map((bill) => (
    <BillCard
      user={user}
      key={bill.id}
      bill={bill}
      setUser={setUser}
      updateWatchList={updateWatchList}
    />
  ));

  return <div>{billCards}</div>;
}
