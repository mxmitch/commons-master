import React from 'react';

import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import Grid from '@mui/material/Grid';

import ProfileText from './ProfileText';

import { Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  avatar: {
    margin: '0 auto',
    width: '100px',
    height: '100px',
    marginBottom: theme.spacing(2),
  },
  personIcon: {
    width: '75px',
    height: '75px',
  },
  profileName: {
    textAlign: 'center',
  },
  form: {
    padding: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(4),
  },
}));

const Profile = ({ categories, user, handleProfileUpdate }) => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <Avatar className={classes.avatar}>
            <PersonIcon className={classes.personIcon} />
          </Avatar>
          <Typography variant="h5" className={classes.profileName}>
            {user.username}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <div className={classes.form}>
            <ProfileText
              user={user}
              categories={categories}
              handleProfileUpdate={handleProfileUpdate}
            ></ProfileText>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
