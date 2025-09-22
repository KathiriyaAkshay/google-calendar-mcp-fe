import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Integrations from './pages/Integrations'
import Personal from './pages/Personal'
import queryClient from './service/queryClient'

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
            <Route path="/" element={<Login />} />

            {/* Login page route */}
            <Route path="/login" element={<Login />} />
            
            {/* Signup page route  */}
            <Route path="/signup" element={<Signup />} />
            
            {/* Forgetpassword related route  */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Homepage  */}
            <Route path="/home" element={<Dashboard />} />
            
            {/* Setting related page  */}
            <Route path="/settings" element={<Settings />} />
            
            {/* Integration related page  */}
            <Route path="/integrations" element={<Integrations />} />
            
            {/* Personal information related page  */}
            <Route path="/personal" element={<Personal />} />
          </Routes>
        </Content>
      </Layout>
    </ThemeProvider>
    </QueryClientProvider>
  )
}
