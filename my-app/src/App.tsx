import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import ResourcesUsage from './components/ResourcesUsage';
import LoginPage from './components/LoginPage';

// used `npm install --save-dev @types/react @types/react-dom @types/react-router-dom
// and `npm install react-router-dom@latest`

// Simple auth check - you might want to implement a more robust solution
const isAuthenticated = () => {
  // Replace this with your actual authentication check
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="resources" element={<ResourcesUsage />} />
          {/* You can add more routes here for other sections like Settings, etc. */}
        </Route>

        {/* Redirect all other routes to login if not authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
