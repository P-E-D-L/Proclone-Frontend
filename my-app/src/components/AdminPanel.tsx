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

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleMouseEnter = (linkName: string) => {
    setHoveredLink(linkName);
  };

  const handleMouseLeave = () => {
    setHoveredLink(null);
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
          <Link
            to="/admin"
            style={{
              ...styles.navLinkText,
              ...(hoveredLink === 'dashboard' && styles.navLinkTextHover),
            }}
            onMouseEnter={() => handleMouseEnter('dashboard')}
            onMouseLeave={handleMouseLeave}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/resources"
            style={{
              ...styles.navLinkText,
              ...(hoveredLink === 'resources' && styles.navLinkTextHover),
            }}
            onMouseEnter={() => handleMouseEnter('resources')}
            onMouseLeave={handleMouseLeave}
          >
            Resources
          </Link>

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
 * 
 * USING TO TEST /api/admin/proxmox/resources endpoint and get response in console :)
 */
const AdminPanel: React.FC = () => {

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

  useEffect(() => {
    fetch('/api/proxmox/templates', {
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
    <div style={styles.dashboardContainer}>
      <Menu />
      <div style={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

// Styles object containing all component styles
const styles: { [key: string]: CSSProperties } = {
  // Main container layout
  container: {
    display: 'flex',
    height: '100vh',
  },
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // Light background
    flexDirection: 'column',
    fontFamily: 'Canvas Sans, sans-serif',
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
  navLinkText: {
    color: '#333', // Default dark text color
    fontSize: '1.1em',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginRight: '20px',
    cursor: 'pointer',
  },
  navLinkTextHover: {
    color: '#f8f9fa', // Color to change to on hover (blue in this example)
  },
};

export default AdminPanel;