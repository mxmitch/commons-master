import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import useLoading from '../../hooks/useLoading';

export default function FindMyMp({ user }) {
  const [postalCode, setPostalCode] = useState(user.postal_code || '');
  const [mpName, setMpName] = useState('');
  const [mpParty, setMpParty] = useState('');
  const [mpPhoto, setMpPhoto] = useState('');
  const [mpRiding, setMpRiding] = useState('');
  const [mpWebsite, setMpWebsite] = useState('');
  const [mpEmail, setMpEmail] = useState('');
  const [mpOfficeOttawa, setMpOfficeOttawa] = useState('');
  const [mpOfficeLocal, setMpOfficeLocal] = useState('');

  const [errors, setErrors] = useState('');
  const { loading, updateLoadingState } = useLoading(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      textAlign: 'center'
    },
    title: {
      marginBottom: theme.spacing(2)
    },
    myMp: {
      textAlign: 'left'
    },
    divider: {
      margin: '1em'
    },
    section: {
      marginBottom: theme.spacing(2)
    },
    submit: {
      margin: '0.75em'
    },
    button: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2)
    }
  }));

  const classes = useStyles();

  useEffect(() => {
    validate(postalCode);
  }, [postalCode]);

  const validate = (value) => {
    const postalCodeRegex = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;
    let errorStr = '';
    let isValid = true;

    if (!(postalCode.length === 0 || postalCodeRegex.test(postalCode))) {
      errorStr = 'Postal code must look like: A1A1A1.';
      isValid = false;
    }

    setErrors(errorStr);
    return isValid;
  };

  const handleMp = () => {
    return (
      <Container xs={12} className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={4} md={4} style={{ marginBottom: '24px' }}>
            <img alt="Your MP" src={mpPhoto} />
          </Grid>
          <Grid item xs={12} sm={8} md={8} className={classes.myMp}>
            <Typography variant="h4" className={classes.title}>
              <strong>Your Representative</strong>
            </Typography>
            <div className={classes.section}>
              <Typography>
                <strong>Name:</strong> {mpName}
              </Typography>
              <Typography>
                <strong>Party: </strong>
                {mpParty}
              </Typography>
              <Typography>
                <strong>Riding: </strong>
                {mpRiding}
              </Typography>
              <Typography>
                <strong>Email: </strong>
                {mpEmail}
              </Typography>
              <Button
                className={classes.button}
                variant="contained"
                href={mpWebsite}
                target="_blank"
              >
                WEBSITE
              </Button>
            </div>
            <div className={classes.section}>
              <Typography variant="h5">
                <strong>Federal Office: </strong>
              </Typography>
              <Typography>
                <strong>Address: </strong>
                {mpOfficeLocal.postal}
              </Typography>
              <Typography>
                <strong>Telephone: </strong>
                {mpOfficeLocal.tel}
              </Typography>
            </div>
            <div className={classes.section}>
              <Typography variant="h5">
                <strong>Local Office: </strong>
              </Typography>
              <Typography>
                <strong>Address: </strong>
                {mpOfficeOttawa.postal}
              </Typography>
              <Typography>
                <strong>Telephone: </strong>
                {mpOfficeOttawa.tel}
              </Typography>
              <Button
                href={`mailto:${mpEmail.toLowerCase()}`}
                variant="contained"
                className={classes.button}
              >
                Email My MP
              </Button>
              <Button
                href={`tel:+${mpOfficeOttawa.tel}`}
                variant="contained"
                className={classes.button}
              >
                Call My MP
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    );
  };

  const handleMpSubmit = async (event) => {
    event.preventDefault();
    const strippedPostalCode = postalCode.replace(/ /g, '');
    setPostalCode((prev) => prev.replace(/ /g, ''));
    updateLoadingState(true);

    console.log(strippedPostalCode)

    if (validate()) {
      try {
        const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://represent.opennorth.ca/postcodes/${strippedPostalCode}/?sets=federal-electoral-districts`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          }
      });
        setMpName(response.data.representatives_centroid[0].name);
        setMpParty(response.data.representatives_centroid[0].party_name);
        setMpPhoto(response.data.representatives_centroid[0].photo_url);
        setMpRiding(response.data.representatives_centroid[0].district_name);
        setMpWebsite(response.data.representatives_centroid[0].url);
        setMpEmail(response.data.representatives_centroid[0].email);
        setMpOfficeLocal(response.data.representatives_centroid[0].offices[0]);
        setMpOfficeOttawa(response.data.representatives_centroid[0].offices[1]);
        updateLoadingState(false);
      } catch (error) {
        updateLoadingState(false);
        console.error(`Error occurred on handleMpSubmit: ${error}`);
      }
    }
  };

  const findForm = () => {
    return (
      <div className={classes.root}>
        {loading && <LoadingSpinner></LoadingSpinner>}
        {!loading && (
          <Fragment>
            <Typography className={classes.title} variant="h4">
              Find Your Member of Parliament
            </Typography>
            <Typography variant="h5" style={{ marginBottom: '1em' }}>
              Look up your representative in the House of Commons
            </Typography>
            <form>
              <TextField
                id="outlined-basic"
                name="postalCode"
                label="Postal Code"
                variant="outlined"
                error={errors && errors.length > 0}
                helperText={errors}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleMpSubmit}
              >
                Submit
              </Button>
            </form>
          </Fragment>
        )}
      </div>
    );
  };
  return <div>{!mpName ? findForm() : handleMp()}</div>;
}
