import React, { useState, useEffect, Fragment } from 'react';

import { makeStyles } from '@mui/styles';
import ChipsArray from '../SignupPage/ChipsArray';

import mapUserFieldToLabel from '../../helpers/mapUserFieldToLabel';
import validationFunctions from '../../helpers/validationFunctions';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const ProfileText = ({ user, handleProfileUpdate, categories }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
  const [postalCode, setPostalCode] = useState(user.postal_code || '');
  const [emailNotification, setEmailNotification] = useState(
    user.email_notification
  );
  const [smsNotification, setSmsNotification] = useState(user.sms_notification);
  const [formErrors, setFormErrors] = useState({});

  const initialClicked = {};
  for (const item of user.user_categories) {
    initialClicked[item] = true;
  }
  const [clicked, setClicked] = useState(initialClicked);

  useEffect(() => {
    validateForm();
  }, [
    name,
    username,
    email,
    password,
    passwordConfirmation,
    phoneNumber,
    postalCode,
  ]);

  const useStyles = makeStyles((theme) => ({
    profileTable: {
      display: 'flex',
      flexDirection: 'row',
    },
    buttons: {
      margin: '1em',
      textAlign: 'center',
    },
    button: {
      marginRight: theme.spacing(2),
    },
  }));
  const classes = useStyles();

  const setThisOneClicked = (key) => {
    setClicked((prev) => {
      let state = { ...prev };
      if (state[key]) {
        delete state[key];
      } else {
        state[key] = true;
      }
      return state;
    });
  };

  const validateForm = () => {
    const formValues = {
      id: user.id,
      name: name,
      username: username,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      phoneNumber: phoneNumber,
      postalCode: postalCode,
      emailNotification: emailNotification,
      smsNotification: smsNotification,
      categories: Object.keys(clicked).map((n) => Number(n)),
    };
    const newValidity = {};
    let isValid = true;

    for (const key in formValues) {
      let problem = '';

      if (key === 'passwordConfirmation') {
        problem = validationFunctions[key](
          formValues[key],
          formValues.password
        );
      } else if (key === 'password') {
        problem = validationFunctions[`${key}Update`](formValues[key]);
      } else {
        problem = validationFunctions[key](formValues[key]);
      }

      newValidity[key] = problem;
      if (problem && problem.length) {
        isValid = false;
      }
    }

    setFormErrors(newValidity);
    return isValid;
  };

  const saveForm = () => {
    // Need snake case because Ruby API uses snake case
    const formValues = {
      id: user.id,
      name: name,
      username: username,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      phone_number: phoneNumber,
      postal_code: postalCode,
      email_notification: emailNotification,
      sms_notification: smsNotification,
      categories: Object.keys(clicked).map((n) => Number(n)),
    };

    if (validateForm()) {
      setEditStatus(false);
      formValues.postal_code = formValues.postal_code.replace(/ /g, '');
      handleProfileUpdate(formValues);
    }
  };

  const handleCheckBoxChange = (event, setFunction) => {
    setFunction(event.target.checked);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField
        variant="outlined"
        margin="normal"
        error={formErrors.name && formErrors.name.length > 0}
        helperText={formErrors.name}
        required
        fullWidth
        id="name"
        label={mapUserFieldToLabel('name')}
        name={mapUserFieldToLabel('name')}
        InputProps={{
          readOnly: !editStatus,
        }}
        defaultValue={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <TextField
        variant="outlined"
        margin="normal"
        error={formErrors.username && formErrors.username.length > 0}
        helperText={formErrors.username}
        required
        fullWidth
        id="username"
        label={mapUserFieldToLabel('username')}
        name={mapUserFieldToLabel('username')}
        InputProps={{
          readOnly: !editStatus,
        }}
        defaultValue={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        error={formErrors.email && formErrors.email.length > 0}
        helperText={formErrors.email}
        required
        fullWidth
        id="email"
        label={mapUserFieldToLabel('email')}
        name={mapUserFieldToLabel('email')}
        InputProps={{
          readOnly: !editStatus,
        }}
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {editStatus && (
        <Fragment>
          <TextField
            variant="outlined"
            type="password"
            margin="normal"
            error={formErrors.password && formErrors.password.length > 0}
            helperText={formErrors.password}
            fullWidth
            id="password"
            label={mapUserFieldToLabel('password_digest')}
            name={mapUserFieldToLabel('password_digest')}
            InputProps={{
              readOnly: !editStatus,
            }}
            defaultValue=""
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            type="password"
            margin="normal"
            error={
              formErrors.passwordConfirmation &&
              formErrors.passwordConfirmation.length > 0
            }
            helperText={formErrors.passwordConfirmation}
            fullWidth
            id="password_confirmation"
            label="Confirm password"
            name="Confirm password"
            InputProps={{
              readOnly: !editStatus,
            }}
            defaultValue=""
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </Fragment>
      )}
      <TextField
        variant="outlined"
        margin="normal"
        error={formErrors.phoneNumber && formErrors.phoneNumber.length > 0}
        helperText={formErrors.phoneNumber}
        fullWidth
        id="phone_number"
        label={mapUserFieldToLabel('phone_number')}
        name={mapUserFieldToLabel('phone_number')}
        InputProps={{
          readOnly: !editStatus,
        }}
        defaultValue={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        error={formErrors.postalCode && formErrors.postalCode.length > 0}
        helperText={formErrors.postalCode}
        fullWidth
        id="postal_code"
        label={mapUserFieldToLabel('postal_code')}
        name={mapUserFieldToLabel('postal_code')}
        InputProps={{
          readOnly: !editStatus,
        }}
        defaultValue={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={emailNotification}
            onChange={(e) => handleCheckBoxChange(e, setEmailNotification)}
            inputProps={{ 'aria-label': 'email notification checkbox' }}
            disabled={!editStatus}
          />
        }
        label={mapUserFieldToLabel('email_notification')}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={smsNotification}
            onChange={(e) => handleCheckBoxChange(e, setSmsNotification)}
            inputProps={{ 'aria-label': 'sms notification checkbox' }}
            disabled={!editStatus}
          />
        }
        label={mapUserFieldToLabel('sms_notification')}
      />

      <ChipsArray
        user={user}
        categories={categories}
        clicked={clicked}
        setThisOneClicked={editStatus ? setThisOneClicked : () => {}}
        editStatus={editStatus}
      />

      <div className={classes.buttons}>
        {editStatus ? (
          <Fragment>
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => saveForm()}
              className={classes.button}
            >
              Save
            </Button>
            <Button variant="contained" onClick={(e) => setEditStatus(false)}>
              Cancel
            </Button>
          </Fragment>
        ) : (
          <Button variant="contained" onClick={(e) => setEditStatus(true)}>
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProfileText;
