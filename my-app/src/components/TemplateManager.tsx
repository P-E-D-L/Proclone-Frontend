import React, { useState } from 'react';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Template {
  value: string;
  label: string;
}

const TemplateManager: React.FC = () => {
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [templates, setTemplates] = useState<Template[]>([
    { value: 'web-app', label: 'Web Application' },
    { value: 'database', label: 'Database Server' },
    { value: 'api', label: 'API Service' }
  ]);

  const handleAddTemplates = () => {
    selectedTemplates.forEach(template => {
      alert(`Deploying template: ${template.label}`);
    });
  };

  const handleDeleteTemplates = () => {
    setTemplates(templates.filter(t => !selectedTemplates.some(s => s.value === t.value)));
    setSelectedTemplates([]);
    alert(`Deleted ${selectedTemplates.length} templates`);
  };

  const toggleTemplate = (template: Template) => {
    setSelectedTemplates(prev => 
      prev.some(t => t.value === template.value)
        ? prev.filter(t => t.value !== template.value)
        : [...prev, template]
    );
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Template Management</h3>
      
      <div style={styles.templateList}>
        <h4>Available Templates</h4>
        {templates.map((template) => (
          <div 
            key={template.value} 
            style={{
              ...styles.templateItem,
              backgroundColor: selectedTemplates.some(t => t.value === template.value) 
                ? '#f0f0f0' 
                : 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => toggleTemplate(template)}
          >
            <span>{template.label}</span>
          </div>
        ))}
      </div>

      {selectedTemplates.length > 0 && (
        <div style={styles.buttonGroup}>
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
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  header: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '18px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
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
  templateList: {
    marginTop: '20px',
  },
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
  icon: {
    width: '20px',
    height: '20px',
  },
};

export default TemplateManager; 