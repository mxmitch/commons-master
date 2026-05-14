import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    textAlign: "center",
  },
  avatar: {
    marginBottom: theme.spacing(2),
    width: "120px",
    height: "120px",
    backgroundColor: "#29c0a8",
  },
  message: {
    padding: theme.spacing(2),
  },
  icon: {
    width: "100px",
    height: "100px",
    color: "white",
  },
}));

const Confirmation = () => {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <ThumbUpIcon className={classes.icon} />
      </Avatar>

      <Grid xs={12} className={classes.message}>
        <Typography variant="h4">
          Thank you for signing up!
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Your account has been created successfully.
        </Typography>
      </Grid>

      <Link to="/">
        <Button color="primary" variant="contained">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default Confirmation;