// src/main.tsx
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-datatable/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import './index.css';
import { MantineProvider, createTheme, MantineTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'indigo',
  fontFamily: 'Inter, sans-serif',
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
  },
  headings: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    NavLink: {
      styles: (theme: MantineTheme) => ({
        root: {
          color: theme.white,
          '&:hover': {
            backgroundColor: theme.colors.indigo[5],
            color: theme.white,
          },
          '&[data-active="true"]': {
            backgroundColor: theme.colors.indigo[6],
            color: theme.white,
          },
        },
      }),
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
