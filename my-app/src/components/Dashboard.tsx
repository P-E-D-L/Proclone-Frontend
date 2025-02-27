import React from 'react';
import TemplateManager from './TemplateManager';

const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard</h2>
      <p style={styles.text}>
      Welcome to the Admin Dashboard. Here you can manage users, settings, etc.</p>
      <TemplateManager/>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    color: '#333',
    marginBottom: '20px',
  },
  text: {
    color: '#666',
    marginBottom: '30px',
    fontSize: '16px',
    lineHeight: '1.5',
  },
};

export default Dashboard;
