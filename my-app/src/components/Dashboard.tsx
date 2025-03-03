import React from 'react';
import TemplateManager from './TemplateManager';

/**
 * Dashboard Component
 * 
 * Main dashboard view that displays the template management interface.
 * Serves as the container for the TemplateManager component and provides
 * a welcoming header for users.
 */
const Dashboard: React.FC = () => {
  return (
    // Main dashboard container
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard</h2>
      <p style={styles.text}>
        Welcome to the Admin Dashboard. Here you can manage templates and view deployments.
      </p>
      {/* Template management interface */}
      <TemplateManager />
    </div>
  );
};

// Styles for the Dashboard component
const styles = {
  // Main container styling
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',  // Center the dashboard on the page
  },
  // Header text styling
  header: {
    color: '#333',
    marginBottom: '20px',
  },
  // Welcome message styling
  text: {
    color: '#666',
    marginBottom: '30px',
    fontSize: '16px',
    lineHeight: '1.5',
  },
};

export default Dashboard;
