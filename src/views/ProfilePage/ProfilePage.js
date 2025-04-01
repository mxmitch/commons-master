import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';

// Core components
import Footer from '../../components/Footer/Footer.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import Parallax from '../../components/Parallax/Parallax.js';
import Profile from './Profile'; // Renamed import to avoid confusion
import GridItem from '../../components/Grid/GridItem.js';

import styles from '../../assets/jss/material-kit-react/views/profilePage.js';

const useStyles = makeStyles(styles);

export default function ProfilePage({ user, categories, handleProfileUpdate }) {
  const classes = useStyles();

  return (
    <div>
      <Parallax small filter image={require('../../assets/img/bg10.jpg')}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1
                  style={{
                    textAlign: 'center',
                    fontWeight: 900,
                    color: '#FFFF',
                  }}
                >
                  My Profile
                </h1>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classnames(classes.main, classes.mainRaised)}>
        {user ? (
          <Profile
            user={{ ...user, user_categories: user.user_categories || [] }} // Ensure user_categories is always an array
            categories={categories}
            handleProfileUpdate={handleProfileUpdate}
          />
        ) : (
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading profile...</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
