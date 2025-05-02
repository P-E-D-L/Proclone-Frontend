import React, { useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import dayjs from 'dayjs';

/**
 * Sidebar Component
 * 
 * A navigation sidebar component that provides:
 * - Links to different sections of the admin panel
 * - Current date and time display
 * - Logout functionality
 */
const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // Format current date and time using dayjs library
  const currentDateTime = dayjs().format('MMMM D, YYYY h:mm A');

  /**
   * Handles user logout
   * Removes authentication and redirects to login page
   */
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.sidebarTitle}>Admin Panel</h2>
      {/* Navigation Links */}
      <ul style={styles.sidebarList}>
        <li><Link to="/admin" style={styles.sidebarLink}>Dashboard</Link></li>
        <li><Link to="/admin/resources" style={styles.sidebarLink}>Resources</Link></li>
      </ul>
      {/* Date/Time Display */}
      <div style={styles.dateTimeContainer}>
        <p style={styles.dateTimeText}>
          Current Date & Time:<br />
          {currentDateTime}
        </p>
      </div>
      {/* Logout Button */}
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

/**
 * AdminPanel Component
 * 
 * Main layout component that provides:
 * - Consistent layout structure with sidebar
 * - Navigation between different admin sections
 * - Dynamic content rendering through Outlet
 * 
 * USING TO TEST /api/admin/proxmox/resources endpoint and get response in console :)
 */
const AdminPanel: React.FC = () => {
  useEffect(() => {
    fetch('/api/admin/proxmox/resources', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        response.headers.forEach((value, name) => {
          console.log(`Header: ${name} = ${value}`);
        });
        return response.json();
      })
      .then((data) => {
        console.log('Response Data:', data);
      })
      .catch((error) => {
        console.error('Error fetching resources:', error);
      });
  }, []);

  useEffect(() => {
    fetch('/api/admin/proxmox/virtualmachines', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        response.headers.forEach((value, name) => {
          console.log(`Header: ${name} = ${value}`);
        });
        return response.json();
      })
      .then((data) => {
        console.log('Response Data:', data);
      })
      .catch((error) => {
        console.error('Error fetching resources:', error);
      });
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

// Styles object containing all component styles
const styles = {
  // Main container layout
  container: {
    display: 'flex',
    height: '100vh',
  },
  // Sidebar container styling
  sidebar: {
    width: '250px',
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between' as 'space-between',
  },
  // Sidebar title styling
  sidebarTitle: {
    color: '#fff',
    fontSize: '24px',
    marginBottom: '20px',
  },
  // Navigation list styling
  sidebarList: {
    listStyleType: 'none' as 'none',
    padding: '0',
  },
  // Navigation link styling
  sidebarLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '10px',
    display: 'block' as 'block',
    margin: '5px 0',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  // Hover state for sidebar links
  sidebarLinkHover: {
    backgroundColor: '#555',
  },
  // Main content area styling
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
  // Header text styling
  header: {
    fontSize: '28px',
    marginBottom: '20px',
  },
  // Date/Time display container
  dateTimeContainer: {
    marginTop: '400px',
    padding: '10px',
    backgroundColor: '#444',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  // Date/Time text styling
  dateTimeText: {
    margin: 0,
    lineHeight: '1.5',
  },
};


export default AdminPanel;