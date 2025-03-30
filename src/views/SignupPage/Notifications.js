import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import AnnouncementIcon from '@mui/icons-material/Announcement';

import validationFunctions from '../../helpers/validationFunctions';

const Notifications = (props) => {
  const [state, setState] = useState({
    smsNotification: props.smsNotification,
    emailNotification: props.emailNotification,
    phoneNumber: props.phoneNumber,
    errors: {
      phoneNumber: '',
    },
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { value } = event;
    let errors = state.errors;
    const parsedValue = value.replace(/\D+/g, '');

    errors.phoneNumber = validationFunctions.phoneNumber(parsedValue);

    setState((prevState) => ({
      ...prevState,
      phoneNumber: parsedValue,
      errors,
    }));
  };

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const proceed = (e) => {
    e.preventDefault();
    setSubmitted(true);
    validateForm(state.errors)
      ? props.nextStep(2, state)
      : console.error(`Invalid Form.`);
  };

  const { errors } = state;

  const back = (e) => {
    e.preventDefault();
    props.prevStep();
  };

  const handleEmailCheck = () => {
    setState((prev) => ({
      ...prev,
      emailNotification: !prev.emailNotification,
      errors: { ...prev.errors },
    }));
  };
  const handleSmsCheck = () => {
    setState((prev) => ({
      ...prev,
      smsNotification: !prev.smsNotification,
      errors: { ...prev.errors },
    }));
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      zIndex: 1000,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      alignItems: 'center',
      border: 5,
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    avatar: {
      zIndex: 1000,
      margin: '0 auto',
      marginBottom: theme.spacing(2),
      width: '120px',
      height: '120px',
      backgroundColor: '#29c0a8',
    },
    formControl: {
      zIndex: 1000,
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      textAlign: 'left',
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: '#29c0a8',
    },
    accountCircle: {
      width: '90px',
      height: '90px',
      color: 'white',
    },
    error: {
      color: 'red',
    },
  }));
  const classes = useStyles();

  return (
    <div>
      <Container maxWidth="xs" className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AnnouncementIcon className={classes.accountCircle} />
        </Avatar>
        <Typography variant="h4">Get updates!</Typography>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">
            How would you like to receive notifications?
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={state.emailNotification} />}
              label="Receive notifications by email"
              onChange={handleEmailCheck}
            />
            <FormControlLabel
              control={<Checkbox checked={state.smsNotification} />}
              label="Receive notifications by SMS message"
              onChange={handleSmsCheck}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="phoneNumber"
              autoFocus
              defaultValue={state.phoneNumber}
              onChange={(e) => handleChange(e.target)}
            />
            {submitted && errors.phoneNumber.length > 0 && (
              <span className={classes.error}>{errors.phoneNumber}</span>
            )}
          </FormGroup>
        </FormControl>
        <Button
          className={classes.button}
          color="secondary"
          variant="contained"
          onClick={back}
        >
          Back
        </Button>

        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={proceed}
        >
          Continue
        </Button>
      </Container>
    </div>
  );
};

export default Notifications;
