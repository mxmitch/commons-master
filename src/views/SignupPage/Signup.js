import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import { Typography, TextField, Button, Avatar } from '@mui/material/';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import axios from 'axios';

import validationFunctions from '../../helpers/validationFunctions';

const Signup = (props) => {
  const [state, setState] = useState({
    name: props.name,
    username: props.username,
    email: props.email,
    password: '',
    passwordConfirmation: '',
    postalCode: props.postalCode,
    errors: {
      name: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      postalCode: '',
    },
    available: {
      usernameTaken: '',
      emailTaken: '',
    },
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    validateForm();
  }, [
    state.name,
    state.username,
    state.email,
    state.password,
    state.passwordConfirmation,
    state.postalCode,
  ]);

  const handleChange = (event) => {
    const { name, value } = event;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
      },
      available: {
        usernameTaken: '',
        emailTaken: '',
      },
    }));
  };

  const checkAvailability = async (param, field) => {
    const user = { [field]: param };

    try {
      const checkParam = await axios.post(
        `${process.env.REACT_APP_COMMONS_API}/${field}_exists`,
        { user }
      );
      return checkParam.status === 200 && true;
    } catch (error) {
      const fieldUp = field.charAt(0).toUpperCase() + field.slice(1);
      setState((prevState) => ({
        ...prevState,
        available: {
          ...prevState.available,
          [`${field}Taken`]: `${fieldUp} ${param} is already associated with a user account.`,
        },
      }));
      console.error(`Error occurred on checkAvailability: ${error}`);
      return false;
    }
  };

  const validateForm = () => {
    const formValues = {
      name: state.name,
      username: state.username,
      email: state.email,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation,
      postalCode: state.postalCode,
    };

    const errors = {};
    let isValid = true;

    for (const key in formValues) {
      const problem =
        key === 'passwordConfirmation'
          ? validationFunctions[key](formValues[key], formValues.password)
          : validationFunctions[key](formValues[key]);
      errors[key] = problem;
      if (problem && problem.length) {
        isValid = false;
      }
    }

    setState((prevState) => ({
      ...prevState,
      errors,
      available: {
        ...prevState.available,
      },
    }));

    return isValid;
  };

  const checkValidations = async () => {
    let usernameAvailable = await checkAvailability(state.username, 'username');
    let emailAvailable = await checkAvailability(state.email, 'email');
    const formValidated = validateForm();
    return usernameAvailable && emailAvailable && formValidated && true;
  };

  const proceed = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    const validated = await checkValidations();
    setState((prev) => ({
      ...prev,
      postalCode: prev.postalCode.replace(/ /g, ''),
      errors: {
        ...prev.errors,
      },
      available: {
        ...prev.available,
      },
    }));
    validated ? props.nextStep(1, state) : console.error('Invalid Form');
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
    form: {
      zIndex: 1000,
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      textAlign: 'center',
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
    button: {
      margin: '1em',
    },
    error: {
      color: 'red',
    },
  }));
  const classes = useStyles();

  const generateUsernameErrorString = () => {
    let errorString = '';
    if (state.errors.username.length > 0) {
      errorString += `${state.errors.username}\n`;
    }
    if (state.available.usernameTaken.length > 0) {
      errorString += `${state.available.usernameTaken}`;
    }
    return errorString;
  };

  const generateEmailErrorString = () => {
    let errorString = '';
    if (state.errors.email.length > 0) {
      errorString += `${state.errors.email}\n`;
    }
    if (state.available.emailTaken.length > 0) {
      errorString += `${state.available.emailTaken}`;
    }
    return errorString;
  };

  return (
    <Container maxWidth="xs" className={classes.paper}>
      <Avatar className={classes.avatar}>
        <PersonAddIcon className={classes.accountCircle} />
      </Avatar>
      <Typography variant="h4">
        Not a Member Yet?
        <br /> Sign Up!
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={submitted && state.errors.name.length > 0}
          helperText={submitted ? state.errors.name : ''}
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
          defaultValue={state.name}
          onChange={(e) => handleChange(e.target)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={
            (submitted && state.errors.username.length > 0) ||
            state.available.usernameTaken.length > 0
          }
          helperText={submitted && generateUsernameErrorString()}
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          defaultValue={state.username}
          onChange={(e) => handleChange(e.target)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={
            (submitted && state.errors.email.length > 0) ||
            state.available.emailTaken.length > 0
          }
          helperText={submitted && generateEmailErrorString()}
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          defaultValue={state.email}
          onChange={(e) => handleChange(e.target)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={submitted && state.errors.password.length > 0}
          helperText={submitted && state.errors.password}
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => handleChange(e.target)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={submitted && state.errors.passwordConfirmation.length > 0}
          helperText={submitted && state.errors.passwordConfirmation}
          name="passwordConfirmation"
          label="Confirm Password"
          type="password"
          id="password-confirmation"
          autoComplete="current-password"
          onChange={(e) => handleChange(e.target)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          error={submitted && state.errors.postalCode.length > 0}
          helperText={submitted && state.errors.postalCode}
          name="postalCode"
          label="Postal Code"
          type="postal"
          id="postal-code"
          defaultValue={state.postalCode}
          autoComplete="postal-code"
          onChange={(e) => handleChange(e.target)}
        />
      </form>
      <Button
        classnames={classes.button}
        color="primary"
        variant="contained"
        onClick={proceed}
      >
        Continue
      </Button>
    </Container>
  );
};
export default Signup;
