import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const result = await isAuthenticated();
      setAuth(result);
    }
    checkAuth();
  }, []);

  if (auth === null) {
    return <div></div>;
  }

  return auth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
