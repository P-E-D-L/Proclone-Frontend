import React from 'react';

/**
 * Interface defining the structure of a resource metric
 * Used to track and display various system resource utilization
 */
interface ResourceMetric {
  id: number;      // Unique identifier for the resource
  name: string;    // Display name of the resource
  usage: number;   // Current usage value
  limit: number;   // Maximum limit value
  status: 'Normal' | 'Warning' | 'Critical';  // Current status based on usage
}

/**
 * ResourcesUsage Component
 */
const ResourcesUsage: React.FC = () => {
  // Sample resource metrics data (replace with actual metrics)
  const resources: ResourceMetric[] = [
    { id: 1, name: 'CPU Usage', usage: 45, limit: 100, status: 'Normal' },
    { id: 2, name: 'Memory', usage: 6.2, limit: 8, status: 'Warning' },
    { id: 3, name: 'Disk Space', usage: 230, limit: 500, status: 'Normal' },
    { id: 4, name: 'Network Bandwidth', usage: 80, limit: 100, status: 'Critical' },
  ];

  /**
   * Returns the appropriate color for each status level
   * @param status - The current status of the resource
   * @returns Color code for the status
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Normal':
        return '#28a745';  // Green
      case 'Warning':
        return '#ffc107';  // Yellow
      case 'Critical':
        return '#dc3545';  // Red
      default:
        return '#6c757d';  // Gray
    }
  };

  /**
   * Calculates the percentage of resource usage
   * @param usage - Current usage value
   * @param limit - Maximum limit value
   * @returns Percentage of resource usage
   */
  const getUsagePercentage = (usage: number, limit: number): number => {
    return (usage / limit) * 100;
  };

  return (
    <div style={styles.contentArea}>
      <h2>System Resources</h2>
      {/* Grid of resource metric cards */}
      <div style={styles.metricsGrid}>
        {resources.map((resource) => (
          <div key={resource.id} style={styles.metricCard}>
            {/* Metric title */}
            <h3 style={styles.metricTitle}>{resource.name}</h3>
            {/* Progress bar */}
            <div style={styles.progressBarContainer}>
              <div 
                style={{
                  ...styles.progressBar,
                  width: `${getUsagePercentage(resource.usage, resource.limit)}%`,
                  backgroundColor: getStatusColor(resource.status)
                }}
              />
            </div>
            {/* Usage details and status */}
            <div style={styles.metricDetails}>
              <span>
                {resource.usage} / {resource.limit} {
                  resource.name === 'Memory' ? 'GB' : 
                  resource.name === 'Disk Space' ? 'GB' : 
                  resource.name === 'Network Bandwidth' ? 'Mbps' : '%'
                }
              </span>
              <span style={{ color: getStatusColor(resource.status) }}>
                {resource.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles object containing all component styles
const styles = {
  // Main content area container
  contentArea: {
    padding: '20px',
  },
  // Grid layout for metric cards
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  // Individual metric card styling
  metricCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
  },
  // Progress bar fill
  progressBar: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  // Container for usage details and status
  metricDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    fontSize: '14px',
    color: '#666',
  },
};

export default ResourcesUsage; 