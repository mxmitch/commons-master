import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';

import GridContainer from '../../components/Grid/GridContainer.js';
import GridItem from '../../components/Grid/GridItem.js';
import Parallax from '../../components/Parallax/Parallax.js';
import Footer from '../../components/Footer/Footer.js';
import FindMyMp from './FindMyMp';

import styles from '../../assets/jss/material-kit-react/views/components.js';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { Link } from 'react-router-dom';

const useStyles = makeStyles(styles);

export default function Home({ user }) {
  const classes = useStyles();

  return (
    <div>
      {/* FIXED HEADER OFFSET */}
      <div style={{ marginTop: '-64px' }}>
        <Parallax image={require('../../assets/img/bg7.jpg')}>
          <div className={classes.container}>
            <GridContainer justifyContent="center">
              <GridItem xs={12} sm={12} md={8}>
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
      </div>

      <div className={classnames(classes.main, classes.mainRaised)}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
          }}
        >
          See up to date information on bills in session in the House of
          Commons.
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          mb={4}
        >
          <Button
            component={Link}
            to="/bills"
            variant="contained"
            color="primary"
            size="large"
          >
            View Bills
          </Button>
        </Box>

        <Divider className={classes.divider} />

        <Grid
          container
          justifyContent="center"
          sx={{ py: 4 }}
        >
          <Grid item xs={12}>
            <FindMyMp user={user} />
          </Grid>
        </Grid>
      </div>

      <Footer />
    </div>
  );
}