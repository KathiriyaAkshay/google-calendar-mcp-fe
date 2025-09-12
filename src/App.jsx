import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Layout } from 'antd'
import { ThemeProvider } from './contexts/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Integrations from './pages/Integrations'
import Personal from './pages/Personal'

const { Content } = Layout

export default function App() {
  return (
    <ThemeProvider>
      <Layout className="app-layout" style={{ minHeight: '100vh' }}>
        {/* Floating Theme Toggle */}
        <div className="floating-theme-toggle">
          <ThemeToggle />
        </div>
        <Content>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/personal" element={<Personal />} />
          </Routes>
        </Content>
      </Layout>
    </ThemeProvider>
  )
}
