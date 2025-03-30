import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from '@mui/material/';

const Login = (props) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    errors: {
      email: 'Email is not valid.',
      password: 'Password must be 5 characters long!'
    },
    invalid: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (props.loggedInStatus) {
      redirect('/');
    }
  });

  const handleChange = (event) => {
    const { name, value } = event;
    let errors = state.errors;

    switch (name) {
      case 'email':
        errors.email =
          value.length === 0 || !validEmailRegex.test(value)
            ? 'Email is not valid.'
            : '';
        break;
      case 'password':
        errors.password =
          value.length === 0 || value.length < 5
            ? 'Password must be 5 characters long!'
            : '';
        break;
      default:
        break;
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
      errors,
      invalid: ''
    }));
  };

  const validEmailRegex = RegExp(
    // eslint-disable-next-line
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const { email, password, errors, invalid } = state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    let user = {
      email: email,
      password: password
    };

    if (validateForm(state.errors)) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_COMMONS_API}/login`,
          { user }
        );
        props.handleLogin(response.data);
        redirect('/');
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          invalid: `Email or password is not valid.`
        }));
        console.error(`Error occurred on handleSubmit: ${error}`);
      }
    }
  };

  const redirect = (uri) => {
    props.history.push(uri);
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      zIndex: 1000,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      alignItems: 'center',
      border: 5,
      padding: theme.spacing(2),
      textAlign: 'center'
    },
    avatar: {
      zIndex: 1000,
      margin: '0 auto',
      marginBottom: theme.spacing(2),
      width: '120px',
      height: '120px',
      backgroundColor: '#29c0a8'
    },
    form: {
      zIndex: 1000,
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      textAlign: 'center'
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: '#29c0a8'
    },
    accountCircle: {
      width: '100px',
      height: '100px',
      color: 'white'
    },
    button: {
      margin: '1em'
    }
  }));
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <PersonIcon className={classes.accountCircle} />
      </Avatar>
      <Typography variant="h4">Login</Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={state.email}
          onChange={(e) => handleChange(e.target)}
        />
        {submitted && errors.email.length > 0 && (
          <span className="error">{errors.email}</span>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => handleChange(e.target)}
        />
        {submitted && errors.password.length > 0 && (
          <span className="error">{errors.password}</span>
        )}
        {submitted && invalid.length > 0 && (
          <span className="error">{invalid}</span>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          LOGIN
        </Button>
        <Grid container justify="center">
          <Grid item>
            <Link
              href="#"
              variant="body2"
              component={RouterLink}
              to="/signup-page"
            >
              {'Not a member? Sign up'}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Login;
