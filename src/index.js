import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserHistory } from 'history';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App.js';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';

axios.defaults.withCredentials = true;

var history = createBrowserHistory();

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StyledEngineProvider injectFirst>
  <ThemeProvider theme={theme}>
     <CssBaseline />
    <App history={history} />
  </ThemeProvider>
  </StyledEngineProvider>,
);
