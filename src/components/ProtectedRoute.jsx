import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import userAuthentication from '../service/userauthentication';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = React.useState('loading');

  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setStatus('unauthorized');
      return;
    }

    userAuthentication
      .getMe()
      .then(() => setStatus('authorized'))
      .catch(() => setStatus('unauthorized'));
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;


