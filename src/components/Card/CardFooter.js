import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@mui/styles";
// @material-ui/icons

// core components
import styles from "assets/jss/material-kit-react/components/cardFooterStyle.js";

const useStyles = makeStyles(styles);

export default function CardFooter(props) {
  const classes = useStyles();
  const { className, children, ...rest } = props;
  const cardFooterClasses = classnames({
    [classes.cardFooter]: true,
    [className]: className !== undefined
  });
  return (
    <div className={cardFooterClasses} {...rest}>
      {children}
    </div>
  );
}

CardFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};
