import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ResourcesUsage from './components/ResourcesUsage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/Authentication/ProtectedRoute';

// used `npm install --save-dev @types/react @types/react-dom @types/react-router-dom
// and `npm install react-router-dom@latest`

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected user routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        {/* Protected admin routes */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="resources" element={<ResourcesUsage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
