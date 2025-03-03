import React, { useState } from 'react';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

// Template interface defines the structure for available deployment templates
interface Template {
  value: string;  // Unique identifier for the template
  label: string;  // Display name for the template
}

// Environment interface defines the structure for deployed environments
interface Environment {
  id: string;     // Unique identifier for the environment
  name: string;   // Display name for the environment
  type: string;   // Type of environment (matches template label)
  status: 'deploying' | 'running' | 'failed';  // Current status of the environment
  deployedAt: Date;  // Timestamp when the environment was deployed
}

/**
 * TemplateManager Component
 * 
 * This component manages the deployment templates and displays deployed environments.
 * It provides functionality to:
 * - Select and deploy templates
 * - Delete templates and their associated environments
 * - Display the status of deployed environments
 */
const TemplateManager: React.FC = () => {
  // State for tracking selected templates
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  // State for tracking deployed environments
  const [environments, setEnvironments] = useState<Environment[]>([]);
  // State for available templates
  const [templates, setTemplates] = useState<Template[]>([
    { value: 'web-app', label: 'Web Application' },
    { value: 'database', label: 'Database Server' },
    { value: 'api', label: 'API Service' }
  ]);

  /**
   * Handles the deployment of selected templates
   * Creates a new environment for each selected template and simulates deployment
   * After 5 seconds, updates the environment status from 'deploying' to 'running'
   */
  const handleAddTemplates = () => {
    selectedTemplates.forEach(template => {
      // Create a new environment with unique ID and timestamp
      const newEnvironment: Environment = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${template.label}-${Math.floor(Math.random() * 1000)}`,
        type: template.label,
        status: 'deploying',
        deployedAt: new Date()
      };
      
      // Add the new environment to the list
      setEnvironments(prev => [...prev, newEnvironment]);

      // Simulate deployment completion after 5 seconds
      setTimeout(() => {
        setEnvironments(prev => 
          prev.map(env => 
            env.id === newEnvironment.id 
              ? { ...env, status: 'running' }
              : env
          )
        );
      }, 5000);
    });
    // Clear template selection after deployment
    setSelectedTemplates([]);
  };

  /**
   * Handles the deletion of selected templates
   * Removes templates from the available list and
   * removes any associated deployed environments
   */
  const handleDeleteTemplates = () => {
    // Get the labels of templates being deleted
    const templatesBeingDeleted = selectedTemplates.map(t => t.label);
    
    // Remove the templates from available templates
    setTemplates(templates.filter(t => !selectedTemplates.some(s => s.value === t.value)));
    
    // Remove any deployed environments associated with these templates
    setEnvironments(prev => prev.filter(env => !templatesBeingDeleted.includes(env.type)));
    
    // Clear template selection
    setSelectedTemplates([]);
  };

  /**
   * Toggles the selection state of a template
   * If template is already selected, it will be deselected and vice versa
   */
  const toggleTemplate = (template: Template) => {
    setSelectedTemplates(prev => 
      prev.some(t => t.value === template.value)
        ? prev.filter(t => t.value !== template.value)
        : [...prev, template]
    );
  };

  /**
   * Returns the appropriate color for each environment status
   * deploying -> yellow
   * running -> green
   * failed -> red
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'deploying': return '#ffc107';
      case 'running': return '#28a745';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      {/* Template Management Section */}
      <div style={styles.container}>
        <h3 style={styles.header}>Template Management</h3>
        
        {/* Available Templates List */}
        <div style={styles.templateList}>
          <h4>Available Templates</h4>
          {templates.map((template) => (
            <div 
              key={template.value} 
              style={{
                ...styles.templateItem,
                backgroundColor: selectedTemplates.some(t => t.value === template.value) 
                  ? '#f0f0f0'  // Highlight selected templates
                  : 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => toggleTemplate(template)}
            >
              <span>{template.label}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons - Only shown when templates are selected */}
        {selectedTemplates.length > 0 && (
          <div style={styles.buttonGroup}>
            {/* Deploy Button */}
            <button
              onClick={handleAddTemplates}
              style={{
                ...styles.button,
                backgroundColor: '#28a745',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PlusCircleIcon style={styles.icon} />
              Deploy Templates ({selectedTemplates.length})
            </button>
            {/* Delete Button */}
            <button
              onClick={handleDeleteTemplates}
              style={{
                ...styles.button,
                backgroundColor: '#dc3545',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <TrashIcon style={styles.icon} />
              Delete Templates ({selectedTemplates.length})
            </button>
          </div>
        )}
      </div>

      {/* Deployed Environments Display Section */}
      <div style={styles.container}>
        <h3 style={styles.header}>Deployed Environments</h3>
        {environments.length === 0 ? (
          // Show message when no environments are deployed
          <p style={styles.emptyState}>No environments currently deployed</p>
        ) : (
          // List of deployed environments
          <div style={styles.environmentList}>
            {environments.map((env) => (
              <div key={env.id} style={styles.environmentCard}>
                <div style={styles.environmentInfo}>
                  <span style={styles.environmentName}>{env.name}</span>
                  <span style={styles.environmentType}>{env.type}</span>
                  {/* Status badge with dynamic color based on status */}
                  <span style={{
                    ...styles.status,
                    backgroundColor: getStatusColor(env.status)
                  }}>
                    {env.status}
                  </span>
                  <span style={styles.deployTime}>
                    {new Date(env.deployedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles object containing all component styles
const styles = {
  // Container style for main sections
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  // Header styling
  header: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '18px',
  },
  // Button group container
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  // Base button styling
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    '&:hover': {
      opacity: 0.9,
    },
  },
  // Template list container
  templateList: {
    marginTop: '20px',
  },
  // Individual template item styling
  templateItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  // Icon styling for buttons
  icon: {
    width: '20px',
    height: '20px',
  },
  // Environment list container
  environmentList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  // Individual environment card styling
  environmentCard: {
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #eee',
  },
  // Environment information container
  environmentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  // Environment name styling
  environmentName: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  // Environment type label styling
  environmentType: {
    color: '#666',
    fontSize: '14px',
  },
  // Status badge styling
  status: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  // Deployment time styling
  deployTime: {
    color: '#666',
    fontSize: '12px',
  },
  // Empty state message styling
  emptyState: {
    textAlign: 'center' as const,
    color: '#666',
    fontStyle: 'italic' as const,
    margin: '20px 0',
  },
};

export default TemplateManager; 