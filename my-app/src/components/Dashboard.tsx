import React, { CSSProperties, useState, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

interface Template {
  name: string;
}

interface ApiResponse {
  templates: Template[];
}

const Dashboard: React.FC = () => {
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loadingAvailableTemplates, setLoadingAvailableTemplates] = useState<boolean>(true);
  const [errorAvailableTemplates, setErrorAvailableTemplates] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/proxmox/templates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setAvailableTemplates(data.templates);
        setLoadingAvailableTemplates(false);
      } catch (e: any) {
        setErrorAvailableTemplates(e.message);
        setLoadingAvailableTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSelectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
  };

  const handleDeploy = () => {
    if (selectedTemplate) {
      console.log('Deploying template:', selectedTemplate);
      alert(`Deploying template: ${selectedTemplate} (NOT IMPLEMENTED - Should trigger a backend call to deploy)`);
      setSelectedTemplate(null); // Clear selection after "deploy"
    } else {
      alert('Please select a template to deploy.');
    }
  };

  if (loadingAvailableTemplates) {
    return <p>Loading data...</p>;
  }

  if (errorAvailableTemplates) {
    return <p>Error fetching data: {errorAvailableTemplates}</p>;
  }

  return (
    <div>
      <div style={styles.outerContainer}>
      <h2 style={styles.header}>Dashboard</h2>
        <div style={styles.container}>
          <h3 style={styles.header}>Available Templates</h3>
          <div style={styles.templateList}>
            <h4>Templates Ready for Deployment</h4>
            {availableTemplates.map((template) => (
              <div
                key={template.name}
                style={{
                  ...styles.templateItem,
                  backgroundColor: selectedTemplate === template.name ? '#f0f0f0' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectTemplate(template.name)}
              >
                <span>{template.name}</span>
                {selectedTemplate === template.name && <span>✓</span>}
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div style={styles.buttonGroup}>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: '#28a745',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onClick={handleDeploy}
              >
                <PlusCircleIcon style={styles.icon} />
                Deploy Template
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  outerContainer: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',  // Center the dashboard on the page
  },
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
    justifyContent: 'flex-start',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
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
  },
  icon: {
    width: '20px',
    height: '20px',
  },
};

export default Dashboard;
