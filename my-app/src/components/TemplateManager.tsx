import React, { CSSProperties, useState, useEffect } from 'react';
import { PlusCircleIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';

interface Template {
  name: string;
}

interface ApiResponse {
  templates: Template[];
}

interface DeployedTemplate {
  id: string;
  templateName: string;
  deployedAt: Date;
  status: 'running' | 'stopped' | 'failed'; // You might need to adjust this based on your actual deployed template status
}

interface VM {
  id: string;
  name: string;
  node: string;
  status: 'running' | 'stopped';
  vmid: number;
}

interface VMsApiResponse {
  virtual_machines: VM[];
}

const TemplateManager: React.FC = () => {
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [deployedTemplates, setDeployedTemplates] = useState<DeployedTemplate[]>([]);
  const [vms, setVms] = useState<VM[]>([]);
  const [selectedVmIds, setSelectedVmIds] = useState<Set<number>>(new Set());
  const [loadingAvailableTemplates, setLoadingAvailableTemplates] = useState<boolean>(true);
  const [errorAvailableTemplates, setErrorAvailableTemplates] = useState<string | null>(null);
  const [loadingVMs, setLoadingVMs] = useState<boolean>(true);
  const [errorVMs, setErrorVMs] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchVMs = async () => {
      try {
        const response = await fetch('/api/admin/proxmox/virtualmachines');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: VMsApiResponse = await response.json();
        const mappedVMs = data.virtual_machines.map(vm => ({
          id: vm.id,
          name: vm.name,
          node: vm.node,
          status: vm.status,
          vmid: vm.vmid,
        }));
        setVms(mappedVMs);
        setLoadingVMs(false);
      } catch (e: any) {
        setErrorVMs(e.message);
        setLoadingVMs(false);
      }
    };

    fetchVMs();
  }, []);

  const handleSelectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
  };

  const handleDeploy = () => {
    if (selectedTemplate) {
      console.log('Deploying template:', selectedTemplate);
      alert(`Deploying template: ${selectedTemplate} (NOT IMPLEMENTED - Should trigger a backend call to deploy)`);

      const newDeployedTemplate: DeployedTemplate = {
        id: Math.random().toString(36).substr(2, 9),
        templateName: selectedTemplate,
        deployedAt: new Date(),
        status: 'running', // Initial status
      };
      setDeployedTemplates(prev => [...prev, newDeployedTemplate]);
      setSelectedTemplate(null);
    } else {
      alert('Please select a template to deploy.');
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

  const handleStartVMs = () => {
    if (selectedVmIds.size > 0) {
      console.log('Starting VMs:', Array.from(selectedVmIds));
      alert(`Starting VMs with IDs: ${Array.from(selectedVmIds).join(', ')} (NOT IMPLEMENTED - POST /api/admin/proxmox/virtualmachines/{vmid}/start)`);
      setVms(prev =>
        prev.map(vm =>
          selectedVmIds.has(vm.vmid) && vm.status === 'stopped' ? { ...vm, status: 'running' } : vm
        )
      );
      setSelectedVmIds(new Set());
    } else {
      alert('Please select one or more VMs to start.');
    }
  };

  const handleStopVMs = () => {
    if (selectedVmIds.size > 0) {
      console.log('Stopping VMs:', Array.from(selectedVmIds));
      alert(`Stopping VMs with IDs: ${Array.from(selectedVmIds).join(', ')} (NOT IMPLEMENTED - POST /api/admin/proxmox/virtualmachines/{vmid}/shutdown)`);
      setVms(prev =>
        prev.map(vm =>
          selectedVmIds.has(vm.vmid) && vm.status === 'running' ? { ...vm, status: 'stopped' } : vm
        )
      );
      setSelectedVmIds(new Set());
    } else {
      alert('Please select one or more VMs to stop.');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running': return '#28a745';
      case 'stopped': return '#dc3545';
      case 'failed': return '#ffc107'; // Or any other color for failed
      default: return '#6c757d';
    }
  };

  if (loadingAvailableTemplates || loadingVMs) {
    return <p>Loading data...</p>;
  }

  if (errorAvailableTemplates || errorVMs) {
    return <p>Error fetching data: {errorAvailableTemplates || errorVMs}</p>;
  }

  return (
    <div>
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

      <div style={styles.container}>
        <h3 style={styles.header}>Deployed Templates</h3>
        {deployedTemplates.length === 0 ? (
          <p style={styles.emptyState}>No templates have been deployed yet.</p>
        ) : (
          <div style={styles.deployedTemplateList}>
            {deployedTemplates.map((deployed) => (
              <div key={deployed.id} style={styles.deployedTemplateCard}>
                <span style={styles.deployedTemplateName}>{deployed.templateName}</span>
                <span style={styles.deployedAt}>Created: {deployed.deployedAt.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.container}>
        <h3 style={styles.header}>Deployed Machines</h3>
        {vms.length === 0 ? (
          <p style={styles.emptyState}>No virtual machines currently deployed.</p>
        ) : (
          <div>
            <div style={styles.environmentList}>
              {vms.map((vm) => (
                <div
                  key={vm.vmid}
                  style={{
                    ...styles.environmentCard,
                    backgroundColor: selectedVmIds.has(vm.vmid) ? '#e9ecef' : '#f8f9fa',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelectVm(vm.vmid)}
                >
                  <div style={styles.environmentInfo}>
                    <input
                      type="checkbox"
                      checked={selectedVmIds.has(vm.vmid)}
                      onChange={() => handleSelectVm(vm.vmid)}
                    />
                    <span style={styles.environmentName}>{vm.name}</span>
                    <span style={styles.environmentNode}>({vm.node})</span>
                    <span style={{ ...styles.status, backgroundColor: getStatusColor(vm.status) }}>
                      {vm.status}
                    </span>
                    <span style={styles.vmId}>VM ID: {vm.vmid}</span>
                  </div>
                </div>
              ))}
            </div>
            {selectedVmIds.size > 0 && (
              <div style={styles.buttonGroup}>
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onClick={handleStartVMs}
                >
                  <PlayIcon style={styles.icon} />
                  Start Selected
                </button>
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: '#dc3545',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onClick={handleStopVMs}
                >
                  <StopIcon style={styles.icon} />
                  Stop Selected
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
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
  environmentList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginTop: '20px',
  },
  environmentCard: {
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
  },
  environmentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  environmentName: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  environmentNode: {
    color: '#666',
    fontSize: '12px',
  },
  status: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    minWidth: '70px',
    textAlign: 'center' as const,
  },
  vmId: {
    color: '#888',
    fontSize: '12px',
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#666',
    fontStyle: 'italic' as const,
    margin: '20px 0',
  },
  deployedTemplateList: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  deployedTemplateCard: {
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  deployedTemplateName: {
    fontSize: '14px',
    fontWeight: '500' as const,
    flex: 1,
  },
  deployedAt: {
    color: '#666',
    fontSize: '12px',
  },
};

export default TemplateManager;