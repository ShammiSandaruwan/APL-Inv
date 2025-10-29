import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css' // Import Mantine styles
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{
          colorScheme: 'light',
          primaryColor: 'indigo',
          fontFamily: 'Inter, sans-serif',
          defaultRadius: 'md',
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
)
