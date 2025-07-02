import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Grid, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import useLoading from '../../hooks/useLoading';

export default function FindMyMp({ user }) {
  const [postalCode, setPostalCode] = useState(user?.postal_code || '');
  const [mpName, setMpName] = useState('');
  const [mpParty, setMpParty] = useState('');
  const [mpPhoto, setMpPhoto] = useState('');
  const [mpRiding, setMpRiding] = useState('');
  const [mpWebsite, setMpWebsite] = useState('');
  const [mpEmail, setMpEmail] = useState('');
  const [mpOfficeOttawa, setMpOfficeOttawa] = useState({});
  const [mpOfficeLocal, setMpOfficeLocal] = useState({});
  const [errors, setErrors] = useState('');
  const { loading, updateLoadingState } = useLoading(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      textAlign: 'center',
    },
    title: {
      marginBottom: '1em',
    },
    myMp: {
      textAlign: 'left',
    },
    section: {
      marginBottom: '1em',
    },
    submit: {
      marginTop: '1em',
      marginRight: '1em',
    },
  }));

  const classes = useStyles();

  const validate = (value) => {
    const postalCodeRegex = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;
    if (!value || !postalCodeRegex.test(value)) {
      setErrors('Postal code must look like: A1A1A1.');
      return false;
    }
    setErrors('');
    return true;
  };

  const handleMpSubmit = async () => {
    const strippedPostalCode = postalCode.replace(/\s/g, '');

    if (!validate(strippedPostalCode)) return;

    updateLoadingState(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_COMMONS_API}/api/findmp/mp/${strippedPostalCode}`
      );

      const mp = response.data.representatives_centroid?.[0];
      if (!mp) throw new Error("No MP found");

      setMpName(mp.name);
      setMpParty(mp.party_name);
      setMpPhoto(mp.photo_url);
      setMpRiding(mp.district_name);
      setMpWebsite(mp.url);
      setMpEmail(mp.email);
      setMpOfficeLocal(mp.offices?.[0] || {});
      setMpOfficeOttawa(mp.offices?.[1] || {});
    } catch (error) {
      console.error("Error occurred on handleMpSubmit:", error);
      alert("Failed to retrieve MP.");
    } finally {
      updateLoadingState(false);
    }
  };

  const handleUseMyLocation = () => {
    updateLoadingState(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      updateLoadingState(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(
            `${process.env.REACT_APP_COMMONS_API}/api/findmp/point?lat=${latitude}&lng=${longitude}`
          );
          
          const mp = response.data.objects?.find(
            (rep) =>
              rep.elected_office?.toLowerCase() === 'mp' ||
              rep.representative_set_name?.toLowerCase().includes('house of commons')
          );
          
          if (!mp) {
            console.warn("⚠️ No MP found in:", response.data.objects);
            alert("We couldn’t find a federal MP for your location.");
            updateLoadingState(false);
            return;
          }

          setMpName(mp.name);
          setMpParty(mp.party_name);
          setMpPhoto(mp.photo_url);
          setMpRiding(mp.district_name);
          setMpWebsite(mp.url);
          setMpEmail(mp.email);
          setMpOfficeLocal(mp.offices?.[1] || {});
          setMpOfficeOttawa(mp.offices?.[0] || {});
        } catch (error) {
          console.error("Geolocation MP lookup error:", error);
          alert("We couldn’t find your MP. Please enter your postal code manually.");
        } finally {
          updateLoadingState(false);
        }
      },
      (error) => {
        console.warn("Geolocation failed:", error);
        alert("Location access denied. You can still enter your postal code to find your MP.");
        updateLoadingState(false);
      }
    );
  };

  const renderMpInfo = () => (
    <Container className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          {mpPhoto && <img alt="Your MP" src={mpPhoto} style={{ maxWidth: '100%' }} />}
        </Grid>
        <Grid item xs={12} sm={8} className={classes.myMp}>
          <Typography variant="h4" className={classes.title}><strong>Your Representative</strong></Typography>
          <div className={classes.section}>
            <Typography><strong>Name:</strong> {mpName}</Typography>
            <Typography><strong>Party:</strong> {mpParty}</Typography>
            <Typography><strong>Riding:</strong> {mpRiding}</Typography>
            <Typography><strong>Email:</strong> {mpEmail}</Typography>
            {mpWebsite && (
              <Button variant="contained" className={classes.submit} href={mpWebsite} target="_blank">
                Website
              </Button>
            )}
          </div>

          {mpOfficeOttawa?.tel && (
            <div className={classes.section}>
              <Typography variant="h5"><strong>Ottawa Office:</strong></Typography>
              <Typography><strong>Address:</strong> {mpOfficeOttawa.postal}</Typography>
              <Typography><strong>Telephone:</strong> {mpOfficeOttawa.tel}</Typography>
            </div>
          )}

          {mpOfficeLocal?.tel && (
            <div className={classes.section}>
              <Typography variant="h5"><strong>Local Office:</strong></Typography>
              <Typography><strong>Address:</strong> {mpOfficeLocal.postal}</Typography>
              <Typography><strong>Telephone:</strong> {mpOfficeLocal.tel}</Typography>
            </div>
          )}

          {mpEmail && (
            <Button variant="contained" className={classes.submit} href={`mailto:${mpEmail}`}>
              Email My MP
            </Button>
          )}
          {mpOfficeOttawa?.tel && (
            <Button variant="contained" className={classes.submit} href={`tel:+${mpOfficeOttawa.tel}`}>
              Call My MP
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );

  const renderForm = () => (
    <div className={classes.root}>
      {loading && <LoadingSpinner />}
      {!loading && (
        <Box mt={2}>
          <Typography className={classes.title} variant="h4">
            Find Your Member of Parliament
          </Typography>
          <Typography variant="h5" style={{ marginBottom: '1em' }}>
            Look up your representative in the House of Commons
          </Typography>
          <form>
            <TextField
              name="postalCode"
              label="Postal Code"
              variant="outlined"
              error={Boolean(errors)}
              helperText={errors}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <Box display="flex" gap={2} mt={2} justifyContent="center">
              <Button variant="contained" color="primary" onClick={handleMpSubmit}>
                Submit Postal Code
              </Button>
              <Button variant="outlined" onClick={handleUseMyLocation}>
                Use My Location
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </div>
  );

  return <div>{!mpName ? renderForm() : renderMpInfo()}</div>;
}
