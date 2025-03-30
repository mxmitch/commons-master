import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import idToCategoryName from './helpers/idToCategoryName';

const Confirmation = (props) => {
  const back = (e) => {
    e.preventDefault();
    props.prevStep();
  };

  const proceed = (event) => {
    event.preventDefault();
    props.nextStep(4);
  };

  const categories = props.details.categories.map((categoryId) => {
    return (
      <Typography key={categoryId}>{idToCategoryName(categoryId)}</Typography>
    );
  });

  const useStyles = makeStyles((theme) => ({
    paper: {
      zIndex: 1000,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: 5,
      padding: theme.spacing(2),
      textAlign: 'center'
    },
    avatar: {
      zIndex: 1000,
      marginBottom: theme.spacing(2),
      width: '120px',
      height: '120px',
      backgroundColor: '#29c0a8'
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
    backDrop: {
      position: 'absolute',
      height: '75%',
      width: '100%',
      bottom: 0,
      left: 0,
      zIndex: 0
    },
    left: {
      textAlign: 'left',
      padding: theme.spacing(2)
    },
    buttons: {
      margin: '0 auto'
    }
  }));
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <CheckCircleIcon className={classes.accountCircle} />
      </Avatar>
      <Typography variant='h4'>Confirm your details</Typography>
      <Grid xs={12} className={classes.left}>
        <Typography>
          <strong>Name: </strong>
          {props.details.name}
        </Typography>
        <Typography>
          <strong>Username: </strong>
          {props.details.username}
        </Typography>
        <Typography>
          <strong>Email: </strong>
          {props.details.email}
        </Typography>
        <Typography>
          <strong>Selected Categories: </strong>
        </Typography>
        {categories}
      </Grid>
      <Container className={classes.buttons}>
        <Button color='secondary' variant='contained' onClick={back}>
          Back
        </Button>

        <Button color='primary' variant='contained' onClick={proceed}>
          Submit
        </Button>
      </Container>
      <div>{props.errors ? props.handleErrors() : null}</div>
    </div>
  );
};

export default Confirmation;
