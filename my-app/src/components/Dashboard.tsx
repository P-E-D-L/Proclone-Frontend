import React, { CSSProperties, useState, useEffect } from 'react';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

interface Template {
  name: string;
}

interface TemplateApiResponse {
  templates: Template[];
}

interface DeployedPod {
  name: string;
}

interface UserDeployedPodsApiResponse {
  templates: DeployedPod[];
}

interface Pod {
  name: string;
  deployedAt: Date;
}

const Dashboard: React.FC = () => {
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [pods, setPods] = useState<Pod[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedVmIds, setSelectedVmIds] = useState<Set<number>>(new Set());
  const [loadingAvailableTemplates, setLoadingAvailableTemplates] = useState<boolean>(true);
  const [errorAvailableTemplates, setErrorAvailableTemplates] = useState<string | null>(null);

  // NEW: to display user pods only
  const [userpods, setUserpods] = useState<DeployedPod[]>([]);
  const [loadingUserDeployed, setLoadingUserDeployed] = useState<boolean>(true);
  const [errorUserDeployed, setErrorUserDeployed] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/proxmox/templates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TemplateApiResponse = await response.json();
        setAvailableTemplates(data.templates);
        setLoadingAvailableTemplates(false);
      } catch (e: any) {
        setErrorAvailableTemplates(e.message);
        setLoadingAvailableTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

    // fetches pods ONLY belonging to user
    useEffect(() => {
      const fetchUserDeployedPods = async () => {
        console.log("fetchUserDeployedPods - Fetching...");
        setLoadingUserDeployed(true);
        try {
          const response = await fetch('/api/proxmox/pods');
          console.log("fetchUserDeployedPods - Response Status:", response.status);
          if (!response.ok) {
            const text = await response.text();
            console.error("fetchUserDeployedPods - Error Text:", text);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: UserDeployedPodsApiResponse = await response.json();
          console.log("fetchUserDeployedPods - Response Data:", data);
          setUserpods(data.templates === null ? [] : data.templates);
          setLoadingUserDeployed(false);
        } catch (e: any) {
          console.error("fetchUserDeployedPods - Error:", e);
          setErrorUserDeployed(e.message);
          setLoadingUserDeployed(false);
        }
      };
  
      fetchUserDeployedPods();
    }, []);

  const handleSelectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
  };

  const handleDeploy = async () => {
    if (!selectedTemplate) {
      alert('Please select a template to deploy.');
      return;
    }

    try {
      console.log('Deploying template:', selectedTemplate);

      const response = await fetch('/api/proxmox/templates/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ template_name: selectedTemplate }),
      });

      if (!response.ok) {
        const text = await response.text();

        try {
          const errorJson = JSON.parse(text);
          const errorMessage = errorJson.error || 'Unknown error';
          const details = errorJson.details ? ` (${errorJson.details})` : '';
          throw new Error(`Backend error: ${errorMessage}${details}`);
        } catch (jsonErr) {
          throw new Error(`Backend error: ${text}`);
        }
      }

      const data = await response.json();

      // Update the list of deployed templates
      setPods(prev => [...prev, { name: selectedTemplate, deployedAt: new Date() }]);

      // Add the newly deployed pod to the UI (assuming your backend returns pod information)
      const newPod: Pod = {
        name: data.pod_name,
        deployedAt: new Date(),
      };

      setPods(prev => [...prev, newPod]);
      setSelectedTemplate(null);

      // fetchAllpods();

    } catch (error) {
      console.error('Deployment failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Failed to deploy template: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) {
      alert('Please select a template to delete.');
      return;
    }

    try {
      console.log('Deleting template:', selectedTemplate);

      const response = await fetch('/api/proxmox/templates/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ template_name: selectedTemplate }),
      });

      if (!response.ok) {
        const text = await response.text();

        try {
          const errorJson = JSON.parse(text);
          const errorMessage = errorJson.error || 'Unknown error';
          const details = errorJson.details ? ` (${errorJson.details})` : '';
          throw new Error(`Backend error: ${errorMessage}${details}`);
        } catch (jsonErr) {
          throw new Error(`Backend error: ${text}`);
        }
      }

      const data = await response.json();

      // may want to implement updating list of deployed templates to remove the one just deleted

      setSelectedTemplate(null);

    } catch (error) {
      console.error('Deletion failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Failed to delete template: ${errorMessage}`);
    }
  };

  const handleSelectVm = (vmid: number) => {
    const newSelection = new Set(selectedVmIds);
    if (newSelection.has(vmid)) {
      newSelection.delete(vmid);
    } else {
      newSelection.add(vmid);
    }
    setSelectedVmIds(newSelection);
  };

  if (loadingAvailableTemplates || loadingUserDeployed) {
    console.log("Loading...!");
    return <p>Loading data...</p>;
  }

  if (errorAvailableTemplates || errorUserDeployed) {
    console.log("Error occured!");
    return <p>Error fetching data: {errorAvailableTemplates || errorUserDeployed}</p>;
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

        {/* Deployed Templates Belonging to User */}
      <div style={styles.container}>
        <h3 style={styles.header}>Your Deployed Pods</h3>
        {userpods === null || userpods.length === 0 ? (
          <p>No pods have been deployed yet.</p>
        ) : (
          <div style={styles.templateList}>
            {userpods.map((template) => (
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
        )}

        {selectedTemplate && (
          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.button,
                backgroundColor: '#dc3545',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onClick={handleDelete}
            >
              <MinusCircleIcon style={styles.icon} />
              Delete Template
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
