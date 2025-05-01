import React, { useEffect } from 'react';

/**
 * Interface representing the resource metrics for a single Proxmox node
 * @interface NodeResourceMetric
 * @property {string} node_name - The name of the Proxmox node
 * @property {number} cpu_usage - CPU usage percentage (0-100)
 * @property {number} memory_total - Total available memory in bytes
 * @property {number} memory_used - Currently used memory in bytes
 * @property {number} storage_total - Total available storage in bytes
 * @property {number} storage_used - Currently used storage in bytes
 */
interface NodeResourceMetric {
  node_name: string;
  cpu_usage: number;
  memory_total: number;
  memory_used: number;
  storage_total: number;
  storage_used: number;
}

/**
 * Interface representing the aggregated resource metrics for the entire Proxmox cluster
 * @interface ClusterResourceMetric
 * @property {number} total_cpu_usage - Average CPU usage across all nodes
 * @property {number} total_memory_total - Total memory across all nodes in bytes
 * @property {number} total_memory_used - Total used memory across all nodes in bytes
 * @property {number} total_storage_total - Total storage across all nodes in bytes
 * @property {number} total_storage_used - Total used storage across all nodes in bytes
 */
interface ClusterResourceMetric {
  total_cpu_usage: number;
  total_memory_total: number;
  total_memory_used: number;
  total_storage_total: number;
  total_storage_used: number;
}

/**
 * Interface representing the complete response from the Proxmox API
 * @interface ResourceResponse
 * @property {NodeResourceMetric[]} nodes - Array of resource metrics for each node
 * @property {ClusterResourceMetric} cluster - Aggregated metrics for the entire cluster
 * @property {string[]} [errors] - Optional array of error messages
 */
interface ResourceResponse {
  nodes: NodeResourceMetric[];
  cluster: ClusterResourceMetric;
  errors?: string[];
}

/**
 * ResourcesUsage Component
 * 
 * This component displays resource utilization metrics for a Proxmox cluster,
 * including both cluster-wide and per-node statistics. It fetches data from
 * the Proxmox API and presents it in a user-friendly format with progress bars
 * and color-coded status indicators.
 * 
 * The component is divided into two main sections:
 * 1. Cluster Overview - Shows aggregated metrics for the entire cluster
 * 2. Node Details - Shows detailed metrics for each individual node
 * 
 * @component
 * @example
 * <ResourcesUsage />
 */
const ResourcesUsage: React.FC = () => {
  // State management for resources data, loading state, and error handling
  const [resources, setResources] = React.useState<ResourceResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  /**
   * Fetches resource metrics from the Proxmox API
   * This effect runs once when the component mounts
   */
  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Make API request to fetch resource metrics
        const response = await fetch('/api/admin/proxmox/resources');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ResourceResponse = await response.json();
        setResources(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load resource metrics');
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  /**
   * Determines the color for resource status indicators based on usage percentage
   * @param {number} usage - Current usage value
   * @param {number} total - Total available value
   * @returns {string} Hex color code for the status indicator
   */
  const getStatusColor = (usage: number, total: number): string => {
    const percentage = (usage / total) * 100;
    if (percentage >= 90) return '#dc3545';  // Red for Critical (≥90%)
    if (percentage >= 70) return '#ffc107';  // Yellow for Warning (70-89%)
    return '#28a745';  // Green for Normal (<70%)
  };

  /**
   * Converts bytes to a human-readable format in GB
   * @param {number} bytes - Number of bytes to convert
   * @returns {string} Formatted string with GB value
   */
  const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!resources) return <div>No data available</div>;

  return (
    <div style={styles.contentArea}>
      <h2>System Resources</h2>
      
      {/* Cluster Overview Section */}
      <div style={styles.clusterSection}>
        <h3>Cluster Overview</h3>
        <div style={styles.metricsGrid}>
          {/* CPU Usage Card */}
          <div style={styles.metricCard}>
            <h4>CPU Usage</h4>
            <div style={styles.progressBarContainer}>
              <div 
                style={{
                  ...styles.progressBar,
                  width: `${resources.cluster.total_cpu_usage}%`,
                  backgroundColor: getStatusColor(resources.cluster.total_cpu_usage, 100)
                }}
              />
            </div>
            <div style={styles.metricDetails}>
              <span>{resources.cluster.total_cpu_usage.toFixed(2)}%</span>
            </div>
          </div>
          
          {/* Memory Usage Card */}
          <div style={styles.metricCard}>
            <h4>Memory Usage</h4>
            <div style={styles.progressBarContainer}>
              <div 
                style={{
                  ...styles.progressBar,
                  width: `${(resources.cluster.total_memory_used / resources.cluster.total_memory_total) * 100}%`,
                  backgroundColor: getStatusColor(resources.cluster.total_memory_used, resources.cluster.total_memory_total)
                }}
              />
            </div>
            <div style={styles.metricDetails}>
              <span>{formatBytes(resources.cluster.total_memory_used)} / {formatBytes(resources.cluster.total_memory_total)}</span>
            </div>
          </div>
          
          {/* Storage Usage Card */}
          <div style={styles.metricCard}>
            <h4>Storage Usage</h4>
            <div style={styles.progressBarContainer}>
              <div 
                style={{
                  ...styles.progressBar,
                  width: `${(resources.cluster.total_storage_used / resources.cluster.total_storage_total) * 100}%`,
                  backgroundColor: getStatusColor(resources.cluster.total_storage_used, resources.cluster.total_storage_total)
                }}
              />
            </div>
            <div style={styles.metricDetails}>
              <span>{formatBytes(resources.cluster.total_storage_used)} / {formatBytes(resources.cluster.total_storage_total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Details Section */}
      <div style={styles.nodesSection}>
        <h3>Node Details</h3>
        <div style={styles.metricsGrid}>
          {resources.nodes.map((node) => (
            <div key={node.node_name} style={styles.nodeCard}>
              <h4>{node.node_name}</h4>
              
              {/* Node CPU Usage */}
              <div style={styles.metricCard}>
                <h5>CPU Usage</h5>
                <div style={styles.progressBarContainer}>
                  <div 
                    style={{
                      ...styles.progressBar,
                      width: `${node.cpu_usage}%`,
                      backgroundColor: getStatusColor(node.cpu_usage, 100)
                    }}
                  />
                </div>
                <div style={styles.metricDetails}>
                  <span>{node.cpu_usage.toFixed(2)}%</span>
                </div>
              </div>

              {/* Node Memory Usage */}
              <div style={styles.metricCard}>
                <h5>Memory Usage</h5>
                <div style={styles.progressBarContainer}>
                  <div 
                    style={{
                      ...styles.progressBar,
                      width: `${(node.memory_used / node.memory_total) * 100}%`,
                      backgroundColor: getStatusColor(node.memory_used, node.memory_total)
                    }}
                  />
                </div>
                <div style={styles.metricDetails}>
                  <span>{formatBytes(node.memory_used)} / {formatBytes(node.memory_total)}</span>
                </div>
              </div>

              {/* Node Storage Usage */}
              <div style={styles.metricCard}>
                <h5>Storage Usage</h5>
                <div style={styles.progressBarContainer}>
                  <div 
                    style={{
                      ...styles.progressBar,
                      width: `${(node.storage_used / node.storage_total) * 100}%`,
                      backgroundColor: getStatusColor(node.storage_used, node.storage_total)
                    }}
                  />
                </div>
                <div style={styles.metricDetails}>
                  <span>{formatBytes(node.storage_used)} / {formatBytes(node.storage_total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Styles object containing all component styles
 * @type {Object}
 */
const styles = {
  // Main content area container
  contentArea: {
    padding: '20px',
  },
  // Cluster overview section
  clusterSection: {
    marginBottom: '30px',
  },
  // Node details section
  nodesSection: {
    marginTop: '20px',
  },
  // Grid layout for metric cards
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  // Individual node card styling
  nodeCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  // Individual metric card styling
  metricCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '15px',
  },
  // Metric title styling
  metricTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    color: '#333',
  },
  // Progress bar container
  progressBarContainer: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    overflow: 'hidden',
    margin: '10px 0',
  },
  // Progress bar fill
  progressBar: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  // Container for usage details
  metricDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666',
  },
};

export default ResourcesUsage;