import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import GridContainer from '../../components/Grid/GridContainer.js';
import GridItem from '../../components/Grid/GridItem.js';
import Parallax from '../../components/Parallax/Parallax.js';
import styles from '../../assets/jss/material-kit-react/views/components.js';
import { Typography, CircularProgress } from '@mui/material/';
import FindMyMp from './FindMyMp';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer.js';

const useStyles = makeStyles(styles);

export default function Home({ user }) {
  const classes = useStyles();

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
        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            component={Link}
            to="/bills"
            variant="contained"
            color="primary"
          >
            View Bills
          </Button>
        </Box>
        <Divider className={classes.divider}></Divider>
        <Grid container justify="center">
          <Grid item xs={12}>
            <FindMyMp user={user} />
          </Grid>
        </Grid>
      </div>
      <Footer/>
    </div>
  );
}
