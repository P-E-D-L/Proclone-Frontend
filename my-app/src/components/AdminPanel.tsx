import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

// Sidebar Component
const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.sidebarTitle}>Admin Panel</h2>
      <ul style={styles.sidebarList}>
        <li><Link to="/" style={styles.sidebarLink}>Dashboard</Link></li>
        <li><Link to="/resources" style={styles.sidebarLink}>Resources</Link></li>
      </ul>
      <button 
        onClick={handleLogout}
        style={{
          ...styles.sidebarLink,
          marginTop: 'auto',
          backgroundColor: '#ff4444'
        }}
      >
        Logout
      </button>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

const styles = {
    container: {
      display: 'flex',
      height: '100vh',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#333',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'space-between' as 'space-between',
    },
    sidebarTitle: {
      color: '#fff',
      fontSize: '24px',
      marginBottom: '20px',
    },
    sidebarList: {
      listStyleType: 'none' as 'none',
      padding: '0',
    },
    sidebarLink: {
      color: 'white',
      textDecoration: 'none',
      padding: '10px',
      display: 'block' as 'block',
      margin: '5px 0',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
    },
    sidebarLinkHover: {
      backgroundColor: '#555',
    },
    mainContent: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#f4f4f4',
    },
    header: {
      fontSize: '28px',
      marginBottom: '20px',
    },
  };

export default AdminPanel;