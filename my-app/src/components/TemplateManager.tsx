import React, { CSSProperties, useState, useEffect } from 'react';
import { MinusCircleIcon, PlusCircleIcon, PlayIcon, StopIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Template {
  name: string;
}

interface TemplateApiResponse {
  templates: Template[];
}

interface DeployedPod {
  name: string;
}

interface AllDeployedPodsApiResponse {
  templates: DeployedPod[];
}

interface UserDeployedPodsApiResponse {
  templates: DeployedPod[];
}

interface Pod {
  name: string;
  deployedAt: Date;
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
  const [pods, setPods] = useState<Pod[]>([]);
  const [selectedPod, setSelectedPodselectedPod] = useState<string | null>(null);
  const [vms, setVms] = useState<VM[]>([]);
  const [selectedVmIds, setSelectedVmIds] = useState<Set<number>>(new Set());
  const [loadingAvailableTemplates, setLoadingAvailableTemplates] = useState<boolean>(true);
  const [errorAvailableTemplates, setErrorAvailableTemplates] = useState<string | null>(null);
  const [loadingVMs, setLoadingVMs] = useState<boolean>(true);
  const [errorVMs, setErrorVMs] = useState<string | null>(null);

  // NEW: to display all pods
  const [allpods, setAllpods] = useState<DeployedPod[]>([]);
  const [loadingAllDeployed, setLoadingAllDeployed] = useState<boolean>(true);
  const [errorAllDeployed, setErrorAllDeployed] = useState<string | null>(null);

  // NEW: to display user pods only
  const [userpods, setUserpods] = useState<DeployedPod[]>([]);
  const [loadingUserDeployed, setLoadingUserDeployed] = useState<boolean>(true);
  const [errorUserDeployed, setErrorUserDeployed] = useState<string | null>(null);

  
  // get available templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/proxmox/templates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TemplateApiResponse = await response.json();
        setAvailableTemplates(data.templates === null ? [] : data.templates);
        setLoadingAvailableTemplates(false);
      } catch (e: any) {
        setErrorAvailableTemplates(e.message);
        setLoadingAvailableTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  // get all VMs to list
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

  // fetches all deployed templates
  useEffect(() => {
    const fetchAllDeployedPods = async () => {
      console.log("fetchAllDeployedPods - Fetching...");
      setLoadingAllDeployed(true);
      try {
        const response = await fetch('/api/admin/proxmox/pods/all');
        console.log("fetchAllDeployedPods - Response Status:", response.status);
        if (!response.ok) {
          const text = await response.text();
          console.error("fetchAllDeployedPods - Error Text:", text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AllDeployedPodsApiResponse = await response.json();
        console.log("fetchAllDeployedPods - Response Data:", data);
        setAllpods(data.templates === null ? [] : data.templates);
        setLoadingAllDeployed(false);
      } catch (e: any) {
        console.error("fetchAllDeployedPods - Error:", e);
        setErrorAllDeployed(e.message);
        setLoadingAllDeployed(false);
      }
    };

    fetchAllDeployedPods();
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
    setSelectedPodselectedPod(templateName);
  };

  const handleDeploy = async () => {
    if (!selectedPod) {
      alert('Please select a template to deploy.');
      return;
    }

    const templateToDeploy = selectedPod;

    // assume will work and add to list (hopefully helps prevent user repeatedly spawning pods)
    const newPod: DeployedPod = { name: `LOADING NEW ${templateToDeploy} POD... `};

    // optimistically update the userpods and allpods state
    setUserpods(prev => [...prev, newPod]);
    setAllpods(prev => [...prev, newPod]);


    try {
      console.log('Deploying template:', selectedPod);

      const response = await fetch('/api/proxmox/templates/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ template_name: selectedPod }),
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
      setPods(prev => [...prev, { name: selectedPod, deployedAt: new Date() }]);

      // Add the newly deployed pod to the UI (assuming your backend returns pod information)
      const newPod: Pod = {
        name: data.pod_name,
        deployedAt: new Date(),
      };

      setPods(prev => [...prev, newPod]);
      setSelectedPodselectedPod(null);

      // fetchAllpods();

    } catch (error) {
      console.error('Deployment failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Failed to deploy template: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedPod) {
      alert('Please select a pod to delete.');
      return;
    }

    const templateToDelete = selectedPod; // stores template to remove from list later

    // update state before api call (we are assuming it works)
    // if page is refreshed too fast it might still be on the list
    setUserpods(prevPods => prevPods.filter(pod => pod.name !== templateToDelete));
    setAllpods(prevAllPods => prevAllPods.filter(pod => pod.name !== templateToDelete));

    try {
      console.log('Deleting pod:', selectedPod);

      const response = await fetch('/api/proxmox/pods/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ pod_id: selectedPod }),
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

      setSelectedPodselectedPod(null);

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

  const handleStartVMs = async () => {
    if (selectedVmIds.size > 0) {
      try {
        const startPromises = Array.from(selectedVmIds).map(async (VmId) => {
          const vm = vms.find(v => v.vmid === VmId);
          if (!vm) throw new Error(`VM with ID ${VmId} not found`);

          const response = await fetch(`/api/admin/proxmox/virtualmachines/start`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ vmid: VmId, node: vm.node }),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to start VM ${VmId}`);
          }
        });

        await Promise.all(startPromises);
        
        // Update UI state
        setVms(prev =>
          prev.map(vm =>
            selectedVmIds.has(vm.vmid) && vm.status === 'stopped' ? { ...vm, status: 'running' } : vm
          )
        );
        setSelectedVmIds(new Set());
      } catch (error) {
        console.error('Error starting VMs:', error);
        alert(`Failed to start VMs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      alert('Please select one or more VMs to start.');
    }
  };

  const handleStopVMs = async () => {
    if (selectedVmIds.size > 0) {
      try {
        const stopPromises = Array.from(selectedVmIds).map(async (VmId) => {
          const vm = vms.find(v => v.vmid === VmId);
          if (!vm) throw new Error(`VM with ID ${VmId} not found`);

          const response = await fetch(`/api/admin/proxmox/virtualmachines/shutdown`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ vmid: VmId, node: vm.node }),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to stop VM ${VmId}`);
          }
        });

        await Promise.all(stopPromises);
        
        // Update UI state
        setVms(prev =>
          prev.map(vm =>
            selectedVmIds.has(vm.vmid) && vm.status === 'running' ? { ...vm, status: 'stopped' } : vm
          )
        );
        setSelectedVmIds(new Set());
      } catch (error) {
        console.error('Error stopping VMs:', error);
        alert(`Failed to stop VMs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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

  if (loadingAvailableTemplates || loadingVMs || loadingAllDeployed || loadingUserDeployed) {
    console.log("Loading...!");
    return <p>Loading data...</p>;
  }

  if (errorAvailableTemplates || errorVMs || errorAllDeployed || errorUserDeployed ) {
    console.log("Error occured!");
    return <p>Error fetching data: {errorAvailableTemplates || errorVMs || errorAllDeployed || errorUserDeployed}</p>;
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
                backgroundColor: selectedPod === template.name ? '#f0f0f0' : 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => handleSelectTemplate(template.name)}
            >
              <span>{template.name}</span>
              {selectedPod === template.name && <span>✓</span>}
            </div>
          ))}
        </div>

        {selectedPod && (
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
                  backgroundColor: selectedPod === template.name ? '#f0f0f0' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectTemplate(template.name)}
              >
                <span>{template.name}</span>
                {selectedPod === template.name && <span>✓</span>}
              </div>
            ))}
          </div>
        )}

        {selectedPod && (
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

      {/* All Deployed Templates */}
      <div style={styles.container}>
        <h3 style={styles.header}>All Deployed Pods</h3>
        {allpods === null || allpods.length === 0 ? (
          <p>No pods have been deployed yet.</p>
        ) : (
        <div style={styles.templateList}>
          {allpods.map((template) => (
            <div
              key={template.name}
              style={{
                ...styles.templateItem,
                backgroundColor: selectedPod === template.name ? '#f0f0f0' : 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => handleSelectTemplate(template.name)}
            >
              <span>{template.name}</span>
              {selectedPod === template.name && <span>✓</span>}
            </div>
          ))}
        </div>
      )}

        {selectedPod && (
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
      


      <div style={styles.container}>
        <h3 style={styles.header}>Virtual Machines</h3>
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
  PodList: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  PodCard: {
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  PodName: {
    fontSize: '14px',
    fontWeight: '500' as const,
    flex: 1,
  },
  deployedAt: {
    color: '#666',
    fontSize: '12px',
  },
  PodItem: {
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

export default TemplateManager;