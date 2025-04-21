import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/session', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setAuth(true);
          setIsAdmin(data.isAdmin || false);

          // Automatically redirect based on user role
          if (data.isAdmin && !adminOnly) {
            setRedirectTo('/admin'); // Redirect admins to the admin dashboard
          } else if (!data.isAdmin && adminOnly) {
            setRedirectTo('/dashboard'); // Redirect non-admins to the user dashboard
          }
        } else {
          setAuth(false);
        }
      } catch {
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return auth ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;