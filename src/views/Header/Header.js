import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";

import MenuIcon from "@mui/icons-material/Menu";

import styles from "../../assets/jss/material-kit-react/components/headerStyle.js";
import { Link } from "react-router-dom";

import HeaderLinks from "./HeaderLinks";

const useStyles = makeStyles(styles);

const Header = ({
  color = "white",
  leftLinks,
  brand,
  fixed,
  absolute,
  changeColorOnScroll,
  user,
  loggedIn,
  handleLogout,
}) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!changeColorOnScroll) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const header = headerRef.current;

      if (!header) return;

      if (scrollTop > changeColorOnScroll.height) {
        header.classList.remove(classes[color]);
        header.classList.add(classes[changeColorOnScroll.color]);
      } else {
        header.classList.add(classes[color]);
        header.classList.remove(classes[changeColorOnScroll.color]);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [changeColorOnScroll, color, classes]);

  const rightLinks = (
    <HeaderLinks
      user={user}
      loggedIn={loggedIn}
      handleDrawerToggle={handleDrawerToggle}
      handleLogout={handleLogout}
    />
  );

  const appBarClasses = classnames(
    classes.appBar,
    color && classes[color],
    fixed && classes.fixed,
    absolute && classes.absolute
  );

  const brandComponent = (
  <Link to="/" style={{ textDecoration: "none" }}>
    <Typography
      variant="h6"
      sx={{
        color: color === "transparent" ? "white" : "#333",
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      {brand}
    </Typography>
  </Link>
);

  return (
    <AppBar
      ref={headerRef}
      className={appBarClasses}
      enableColorOnDark
      elevation={0}
      position="fixed"
    >
      <Toolbar className={classes.container}>
        {leftLinks !== undefined ? brandComponent : null}

        <div className={classes.flex}>
          {leftLinks !== undefined ? (
            <Hidden smDown implementation="css">
              {leftLinks}
            </Hidden>
          ) : (
            brandComponent
          )}
        </div>

        <Hidden smDown implementation="css">
          {rightLinks}
        </Hidden>

        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>

      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.appResponsive}>
            {leftLinks}
            {rightLinks}
          </div>
        </Drawer>
      </Hidden>
    </AppBar>
  );
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark",
  ]),
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark",
    ]).isRequired,
  }),
  user: PropTypes.object,
  loggedIn: PropTypes.bool,
  handleLogout: PropTypes.func,
};

export default Header;