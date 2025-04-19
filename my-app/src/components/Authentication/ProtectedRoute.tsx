import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/session', { credentials: 'include' });
        setAuth(response.ok);
      } catch {
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  return auth ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;