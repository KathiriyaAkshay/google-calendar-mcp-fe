import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ConfigProvider, theme } from 'antd'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import App from './App'
import './styles/main.scss'
import './styles/dashboard.scss'
import './styles/password-pages.scss'
import './styles/forgot-password.scss'
import './service'

const queryClient = new QueryClient()

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// Ant Design theme configuration
const AntConfigWrapper = () => {
  const { theme: currentTheme } = useTheme()
  
  const themeConfig = {
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 6,
    },
    algorithm: currentTheme === 'dark' 
      ? theme.darkAlgorithm 
      : theme.defaultAlgorithm,
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AntConfigWrapper />
          </BrowserRouter>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
