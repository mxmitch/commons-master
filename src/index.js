import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserHistory } from 'history';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App.js';
import axios from 'axios';

import './assets/scss/material-kit-react.scss?v=1.8.0';

axios.defaults.withCredentials = true;

var history = createBrowserHistory();

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <App history={history} />
  </ThemeProvider>,
);
