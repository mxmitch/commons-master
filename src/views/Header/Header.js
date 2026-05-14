import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import MenuIcon from '@mui/icons-material/Menu';

import { Link } from 'react-router-dom';

const drawerWidth = 240;

export default function Header({
  loggedIn,
  handleLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navItems = loggedIn
    ? [
      { label: 'Home', path: '/' },
      { label: 'Bills', path: '/bills' },
      { label: 'Watch List', path: '/watch-list' },
    ]
    : [
      { label: 'Home', path: '/' },
      { label: 'Bills', path: '/bills' },
      { label: 'Login', path: '/login-page' },
      { label: 'Sign Up', path: '/signup-page' },
    ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: 'center',
        mt: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 700,
        }}
      >
        Commons
      </Typography>

      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        {loggedIn && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          backgroundColor: '#f44336',
        }}
      >
        <Toolbar>

          {/* MOBILE MENU BUTTON */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* BRAND */}
          <Typography
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontFamily: '"Prompt", sans-serif',
              fontWeight: 700,
              fontSize: '2rem',
              color: '#FFF',
              textDecoration: 'none',
              letterSpacing: '0.5px',
            }}
          >
            Commons
          </Typography>

          {/* DESKTOP NAV */}
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: '#fff',
                }}
              >
                {item.label}
              </Button>
            ))}

            {loggedIn && (
              <Button
                onClick={handleLogout}
                sx={{ color: '#fff' }}
              >
                Logout
              </Button>
            )}
          </Box>

        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <nav>
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: 'block',
              sm: 'none',
            },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      {/* SPACING BELOW FIXED APPBAR */}
      <Toolbar />
    </Box>
  );
}