import React, { CSSProperties, useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import dayjs from 'dayjs';

// needed her to display username
interface Profile {
  message: string;
  isAdmin: boolean;
}

/**
 * Sidebar Component
 * 
 * A navigation sidebar component that provides:
 * - Links to different sections of the admin panel
 * - Current date and time display
 * - Logout functionality
 */
const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // fetches user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Profile = await response.json();
        setUsername(data.message);
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        setError('Failed to load user profile.');
      }
    };

  fetchUserProfile();
  }, []);

  /**
   * Handles user logout
   * Removes authentication and redirects to login page
   */
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  // menu content

  return (
    <div style={styles.header}>
        <div style={styles.userInfoHeader}>
          <span style={styles.usernameHeader}>
            {username ? (
              <p>Hello, {username}!</p>
            ) : (
              <p></p>
            )}
          </span>
          <button onClick={handleLogout} style={styles.signOutButton}>
            <strong>LOGOUT</strong>
          </button>
        </div>
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
 */
const UserPanel: React.FC = () => {
  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar Navigation */}
      <Menu />
      {/* Main Content Area - renders child routes */}
      <div style={styles.mainContent}>
        <Outlet />
      </div>
      {/* insert footer */}
      <div style={styles.footer}>Property of Cal Poly Pomona Student Data Center</div>
    </div>
  );
};

// Styles object containing all component styles
const styles: { [key: string]: CSSProperties } = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // Light background
    flexDirection: 'column',
    fontFamily: 'Canvas Sans, sans-serif',
  },
  header: {
    backgroundColor: '#cecece', // Dark header background
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'flex-end', // Push user info to the right
    alignItems: 'center',
  },
  userInfoHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  usernameHeader: {
    color: '#414141',
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginRight: '15px',
  },
  currentDeployments: {
    width: '90%',
    color: 'white',
    padding: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '14px 20px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    width: '130px',
    maxWidth: '95%',
  },
  navigation: {
    listStyleType: 'none',
    padding: 0,
  },
  navLink: {
    display: 'block',
    color: 'white',
    padding: '12px 15px',
    textDecoration: 'none',
    marginBottom: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.2s',
  },
  navLinkHover: {
    backgroundColor: '#495057',
  },
  deployNewContent: {
    padding: '40px',
    width: '45%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: '20px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  currentDeploymentsTitle: {
    backgroundColor: 'transparent', // Make background transparent for a text header
    color: '#6c757d', // Dark grey text color
    padding: '10px 0', // Adjust padding as needed
    border: 'none',
    borderRadius: '0', // Remove border radius
    fontSize: '1.2em', // Adjust font size
    fontWeight: 'bold',
    width: '100%', // Take full width of the sidebar
    maxWidth: '100%',
    textAlign: 'center',
    marginBottom: '20px', // Add some space below the header
  },
  deployNewButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '14px 20px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    width: '350px',
    maxWidth: '95%',
  },
  searchDropdownButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '14px 20px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    width: '400px',
    maxWidth: '95%',
  },
  tableContainer: {
    width: '100%', // Make the table take full width of its container
    overflowX: 'auto', // Add horizontal scroll for smaller screens
    marginTop: '20px',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9', // Light background for better contrast with dark text
    fontSize: '0.9em',
  },
  dataTableHead: {
    backgroundColor: '#e0e0e0', // Slightly darker header background
    color: '#333', // Dark text for headers
    fontWeight: 'bold',
  },
  dataTableTh: {
    padding: '12px 15px',
    borderBottom: '2px solid #ccc',
    textAlign: 'left',
  },
  dataTableTr: {
      backgroundColor: '#f2f2f2', // Slightly different background for even rows
  },
  dataTableTd: {
    padding: '8px 15px',
    borderBottom: '1px solid #eee',
    color: '#333', // Dark text for data cells
  },
  tablePlaceholder: {
    backgroundColor: '#e0e0e0', // Light grey placeholder
    padding: '50px',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '1.1em',
    color: '#666',
  },
  footer: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%',
    backgroundColor: '#414141',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 0',
    fontSize: '0.8em',
  },
};


export default UserPanel;