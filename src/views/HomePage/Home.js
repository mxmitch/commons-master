import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import GridContainer from '../../components/Grid/GridContainer.js';
import GridItem from '../../components/Grid/GridItem.js';
import Parallax from '../../components/Parallax/Parallax.js';
import styles from '../../assets/jss/material-kit-react/views/components.js';
import CategoryDropdown from './CategoryDropdown';
import Bills from './Bills';
import { Typography, CircularProgress } from '@mui/material/';

const useStyles = makeStyles(styles);

export default function Home(props) {
  const classes = useStyles();
  const [childCategory, setChildCategory] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check for availability of props.bills and props.categories
  useEffect(() => {
    if (props.bills && props.categories) {
      setLoading(false);
    }
  }, [props.bills, props.categories]);

  // Ensure categories are passed correctly to Bills component, fallback if not available
  const categories = props.categories || []; // Default to an empty array if not provided
  const bills = props.bills || []; // Default to an empty array if not provided

  return (
    <div>
      <Parallax image={require('../../assets/img/bg7.jpg')}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 className={classes.title}>Commons</h1>
                <h3 className={classes.subtitle}>
                  Get informed. Stay engaged.
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classnames(classes.main, classes.mainRaised)}>
        <Typography variant="h4" style={{ textAlign: 'center', margin: '1em' }}>
          See up to date information on bills in session in the House of Commons.
        </Typography>

        {loading ? (
          <CircularProgress style={{ display: 'block', margin: 'auto' }} />
        ) : (
          <>
            <CategoryDropdown
              categories={categories}
              passCategory={setChildCategory}
            />
            <Bills
              user={props.user}
              bills={bills}
              childCategory={childCategory}
              setUser={props.setUser}
              updateWatchList={props.updateWatchList}
              categories={categories} // Ensure categories are passed to Bills
            />
          </>
        )}
      </div>
    </div>
  );
}
