import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import PasswordConfig from './pages/PasswordConfig'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Integrations from './pages/Integrations'
import Personal from './pages/Personal'
import queryClient from './service/queryClient'
import ProtectedRoute from './components/ProtectedRoute'
import { appRoutes } from './routes'

const { Content } = Layout

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Layout className="app-layout" style={{ minHeight: '100vh' }}>
          {/* Floating Theme Toggle */}
          <div className="floating-theme-toggle">
            <ThemeToggle />
          </div>
          <Content>
          <Routes>
            {appRoutes.map(({ path, element, protected: isProtected }) => (
              <Route
                key={path}
                path={path}
                element={isProtected ? (
                  <ProtectedRoute>{element}</ProtectedRoute>
                ) : (
                  element
                )}
              />
            ))}
          </Routes>
        </Content>
      </Layout>
    </ThemeProvider>
    </QueryClientProvider>
  )
}
