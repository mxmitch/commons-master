import React from 'react';
import ReactDOM from 'react-dom/client';

import axios from 'axios';

import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider
} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';

import './index.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';

// Enable cookies globally for axios
axios.defaults.withCredentials = true;

// Create MUI theme
const theme = createTheme();

// React root
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AuthProvider>
          <App />
        </AuthProvider>

      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);