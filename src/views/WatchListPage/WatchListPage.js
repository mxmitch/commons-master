import React, { useState } from 'react';
// nodejs library that concatenates classes
import classnames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@mui/styles';
// core components
import GridContainer from '../../components/Grid/GridContainer.js';
import GridItem from '../../components/Grid/GridItem.js';
import Parallax from '../../components/Parallax/Parallax.js';
// sections for this page
import styles from '../../assets/jss/material-kit-react/views/components.js';
import CategoryDropdown from '../HomePage/CategoryDropdown';
import Bills from '../HomePage/Bills';

import image from '../../assets/img/bg8.jpg';

const useStyles = makeStyles(styles);

export default function WatchListPage(props) {
  const classes = useStyles();
  // const { ...rest } = props;

  const [childCategory, setChildCategory] = useState(0);

  const bills = props.bills.filter((bill) => {
    return props.user.user_bills.includes(bill.id);
  });

  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: 'url(' + image + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }}
      ></div>
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
        <CategoryDropdown
          categories={props.categories}
          passCategory={setChildCategory}
        />
        {props.user && (
          <Bills
            user={props.user}
            bills={bills}
            childCategory={childCategory}
            updateWatchList={props.updateWatchList}
          />
        )}
      </div>
    </div>
  );
}
