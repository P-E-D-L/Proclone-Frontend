import React, { CSSProperties, useState, useEffect } from 'react';

/**
 * Dashboard Component
 * 
 * Main dashboard view for non-admin users.
 */

interface Template {
  name: string;
}

interface ApiResponse {
  templates: Template[];
}

const Dashboard: React.FC = () => {

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/proxmox/templates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setTemplates(data.templates);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
  };

  const handleSubmit = () => {
    if (selectedTemplate) {
      console.log('Submitting selected template:', selectedTemplate);
      alert(`POST request with selected template: ${selectedTemplate} (not yet implemented)`);
      // IMPLEMENT POST REQUEST HERE
    } else {
      alert('Please select a template before submitting.');
    }
  };

  if (loading) {
    return <p>Loading templates...</p>;
  }

  if (error) {
    return <p>Error fetching templates: {error}</p>;
  }

  return (
    // Main dashboard container
    <div style={styles.dashboardContainerInner}>
        {/* Current Deployments */}
        <div style={styles.deploymentContainers}>
          <div style ={styles.sectionContainer}>
            <p style={styles.currentDeploymentsTitle}>CURRENT DEPLOYMENTS</p>
          </div>
        </div>

        {/* Deploy New */}
        <div style={styles.deploymentContainers}>
        <div style ={styles.sectionContainer}>
          <div style={styles.actionButtons}>
            { /* <button style={styles.searchDropdownButton}>DROP DOWN SEARCH</button> { implement search } */ }
            <ul style={styles.list}>
              {templates.map((template) => (
                <li key={template.name} style={styles.listItem}>
                  <button
                    style={{
                      ...styles.radioButton,
                      ...(selectedTemplate === template.name
                        ? styles.radioButtonChecked
                        : styles.radioButtonUnchecked),
                    }}
                    onClick={() => handleSelect(template.name)}
                  >
                    {selectedTemplate === template.name && <div style={styles.radioButtonInner} />}
                  </button>
                  <span><p style={styles.templateName}>{template.name}</p></span>
                </li>
              ))}
            </ul>
            <button style={styles.deployNewButton} onClick={handleSubmit} disabled={!selectedTemplate}>
               DEPLOY NEW TEMPLATE
            </button>
          </div>
        </div>
        </div>
      </div>

  );
};

// Styles for the Dashboard component
const styles: { [key: string]: CSSProperties } = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // Light background
    flexDirection: 'column',
    fontFamily: 'Canvas Sans, sans-serif',
  },
  templateName: {
    fontSize: '1.2rem', // Larger font size for template name
    color: '#222', // Darker text color for template name
    fontWeight: '500', // Slightly bolder for emphasis
  },
  sectionContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px",
    width: "90%",
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
  deploymentContainers: {
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
    width: '90%',
    color: 'white',
    padding: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtons: {
    marginBottom: '20px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexDirection: 'column',
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
  title: {
    fontSize: '1.5rem',
    marginBottom: '15px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  radioButton: {
    border: '1px solid #ccc',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    marginRight: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '12px',
  },
  radioButtonChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioButtonInner: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'white',
  },
  radioButtonUnchecked: {
    backgroundColor: 'transparent',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
  loadingText: {
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
  },
};

export default Dashboard;
