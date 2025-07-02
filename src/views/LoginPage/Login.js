import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from '@mui/material/';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    alignItems: 'center',
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  avatar: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    width: '120px',
    height: '120px',
    backgroundColor: '#29c0a8'
  },
  form: {
    width: '100%',
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
  }
}));

const sanitizeInput = (value) => value.trim().replace(/[<>]/g, '');

const Login = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: '',
    password: '',
    errors: { email: '', password: '' },
    invalid: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (props.loggedInStatus) {
      navigate('/');
    }
  }, [props.loggedInStatus, navigate]);

  const validEmailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const validateForm = (errors) => {
    return Object.values(errors).every((val) => val.length === 0);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const cleanValue = sanitizeInput(value);
    let errors = state.errors;

    switch (name) {
      case 'email':
        errors.email =
          cleanValue.length === 0 || !validEmailRegex.test(cleanValue)
            ? 'Email is not valid.'
            : '';
        break;
      case 'password':
        errors.password =
          cleanValue.length === 0 || cleanValue.length < 5
            ? 'Password must be at least 5 characters long.'
            : '';
        break;
      default:
        break;
    }

    setState((prevState) => ({
      ...prevState,
      [name]: cleanValue,
      errors,
      invalid: ''
    }));
  };

  const { email, password, errors, invalid } = state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!validateForm(errors)) {
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_COMMONS_API}/api/auth/login`,
        { email, password },
        { withCredentials: true } // Cookie-based auth
      );

      props.handleLogin(true); // Update auth state in parent
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setState((prevState) => ({
        ...prevState,
        invalid: 'Login failed. Please check your credentials.'
      }));
    }
  };

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
          value={email}
          onChange={handleChange}
        />
        {submitted && errors.email && <span className="error">{errors.email}</span>}

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
          value={password}
          onChange={handleChange}
        />
        {submitted && errors.password && <span className="error">{errors.password}</span>}
        {submitted && invalid && <span className="error">{invalid}</span>}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          LOGIN
        </Button>

        <Grid container justifyContent="center">
          <Grid item>
            <Link component={RouterLink} to="/signup-page" variant="body2">
              {"Not a member? Sign up"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Login;
