import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useUser } from '../UserContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const [auth, setAuth] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    async function checkAuth() {
      const result = await isAuthenticated();
      setAuth(result);
    }
    checkAuth();
  }, []);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (!user || !user.is_staff)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

