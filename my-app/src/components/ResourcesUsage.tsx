import React, { useEffect } from 'react';

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
  const [resources, setResources] = React.useState<ResourceMetric[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Simulate fetching resource metrics from an API
        const response = await fetch('/api/resources');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ResourceMetric[] = await response.json();
        setResources(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load resource metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

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
      {/* Loading and error handling */}
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {/* Grid of resource metric cards */}
      {!loading && !error && (
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
      )}
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