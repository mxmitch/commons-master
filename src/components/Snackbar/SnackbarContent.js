import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@mui/styles";
import Snack from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components

import styles from "assets/jss/material-kit-react/components/snackbarContentStyle.js";

const useStyles = makeStyles(styles);

export default function SnackbarContent(props) {
  const { message, color, close, icon } = props;
  const classes = useStyles();
  var action = [];
  const closeAlert = () => {
    setAlert(null);
  };
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={closeAlert}
      >
        <Close className={classes.close} />
      </IconButton>
    ];
  }
  let snackIcon = null;
  switch (typeof icon) {
    case "object":
      snackIcon = <props.icon className={classes.icon} />;
      break;
    case "string":
      snackIcon = <Icon className={classes.icon}>{props.icon}</Icon>;
      break;
    default:
      snackIcon = null;
      break;
  }
  const [alert, setAlert] = React.useState(
    <Snack
      message={
        <div>
          {snackIcon}
          {message}
          {close !== undefined ? action : null}
        </div>
      }
      classes={{
        root: classes.root + " " + classes[color],
        message: classes.message + " " + classes.container
      }}
    />
  );
  return alert;
}

SnackbarContent.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};
