import React from 'react';
// nodejs library that concatenates classes
import classnames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@mui/styles';
// core components
import Footer from '../../components/Footer/Footer.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import Parallax from '../../components/Parallax/Parallax.js';
import Profile from './Profile';
import GridItem from '../../components/Grid/GridItem.js';

import styles from '../../assets/jss/material-kit-react/views/profilePage.js';

const useStyles = makeStyles(styles);

export default function ProfilePage(props) {
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
                    color: '#FFFF'
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
        {props.user && (
          <Profile
            user={props.user}
            categories={props.categories}
            handleProfileUpdate={props.handleProfileUpdate}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
