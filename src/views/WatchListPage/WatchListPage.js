import React, { useState } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import GridContainer from '../../components/Grid/GridContainer.js';
import GridItem from '../../components/Grid/GridItem.js';
import Parallax from '../../components/Parallax/Parallax.js';
import Bills from '../BillsPage/Bills.js';
import styles from '../../assets/jss/material-kit-react/views/components.js';

const useStyles = makeStyles(styles);

const imageStyle = {
  backgroundImage: 'url(' + require('../../assets/img/bg8.jpg') + ')',
  backgroundSize: 'cover',
  backgroundPosition: 'top center',
};

export default function WatchListPage({ bills, user, categories, updateWatchList }) {
  const classes = useStyles();
  const [childCategory, setChildCategory] = useState(0);

  // Safeguard: ensure user.user_bills is an array before filtering bills
  const userBills = user?.user_bills || []; // Default to empty array if undefined or null

  // Filter bills for the current user's watch list
  const filteredBills = bills.filter((bill) => userBills.includes(bill.id));

  return (
    <div>
      <div className={classes.pageHeader} style={imageStyle}></div>
      <Parallax image={require('../../assets/img/bg8.jpg')}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 style={{ textAlign: 'center', fontWeight: 900 }}>
                  My Watch List
                </h1>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classnames(classes.main, classes.mainRaised)}>
        {user && filteredBills.length > 0 ? (
          <Bills
            user={user}
            bills={filteredBills}
            childCategory={childCategory}
            updateWatchList={updateWatchList}
          />
        ) : (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            No bills in your watchlist yet.
          </div>
        )}
      </div>
    </div>
  );
}
