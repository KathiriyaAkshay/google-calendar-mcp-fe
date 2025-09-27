import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import PasswordConfig from './pages/PasswordConfig'
import ResetPassword from './pages/ResetPassword'
import Settings from './pages/Settings'
import Integrations from './pages/Integrations'
import Personal from './pages/Personal'

export const appRoutes = [
  // Public routes
  { path: '/login', element: <Login />, protected: false },
  { path: '/signup', element: <Signup />, protected: false },
  { path: '/forgot-password', element: <ForgotPassword />, protected: false },
  { path: '/password-config', element: <PasswordConfig />, protected: false },
  { path: '/reset-password', element: <ResetPassword />, protected: false },

  // Protected routes
  { path: '/', element: <Dashboard />, protected: true },
  { path: '/settings', element: <Settings />, protected: true },
  { path: '/integrations', element: <Integrations />, protected: true },
  { path: '/personal', element: <Personal />, protected: true },
]


