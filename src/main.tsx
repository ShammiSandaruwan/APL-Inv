import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css';
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{
          primaryColor: 'blue',
          fontFamily: 'Inter, sans-serif',
          defaultRadius: 'md',
          colors: {
            blue: [
              '#e7f5ff',
              '#d0ebff',
              '#a5d8ff',
              '#74c0fc',
              '#4dabf7',
              '#339af0',
              '#2B6CB0', // Primary Color
              '#1c7ed6',
              '#1971c2',
              '#1864ab',
            ],
            teal: [
              '#e6fcf5',
              '#c3fae8',
              '#96f2d7',
              '#63e6be',
              '#38B2AC', // Secondary Color
              '#20c997',
              '#12b886',
              '#0ca678',
              '#099268',
              '#087f5b',
            ],
            amber: [
              '#fff8e1',
              '#ffecb3',
              '#ffe082',
              '#ffd54f',
              '#ffca28',
              '#F6AD55', // Accent Color
              '#ffb300',
              '#ffa000',
              '#ff8f00',
              '#ff6f00',
            ],
          },
          other: {
            backgroundColor: '#F8FAFC',
            textColor: '#1A202C',
          },
        }}
      >
        <Notifications />
        <AuthProvider>
          <App />
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
)
