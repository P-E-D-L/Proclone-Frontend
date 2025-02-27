import React from 'react';

interface ResourceMetric {
  id: number;
  name: string;
  usage: number;
  limit: number;
  status: 'Normal' | 'Warning' | 'Critical';
}

const ResourcesUsage: React.FC = () => {
  const resources: ResourceMetric[] = [
    { id: 1, name: 'CPU Usage', usage: 45, limit: 100, status: 'Normal' },
    { id: 2, name: 'Memory', usage: 6.2, limit: 8, status: 'Warning' },
    { id: 3, name: 'Disk Space', usage: 230, limit: 500, status: 'Normal' },
    { id: 4, name: 'Network Bandwidth', usage: 80, limit: 100, status: 'Critical' },
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Normal':
        return '#28a745';
      case 'Warning':
        return '#ffc107';
      case 'Critical':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getUsagePercentage = (usage: number, limit: number): number => {
    return (usage / limit) * 100;
  };

  return (
    <div style={styles.contentArea}>
      <h2>System Resources</h2>
      <div style={styles.metricsGrid}>
        {resources.map((resource) => (
          <div key={resource.id} style={styles.metricCard}>
            <h3 style={styles.metricTitle}>{resource.name}</h3>
            <div style={styles.progressBarContainer}>
              <div 
                style={{
                  ...styles.progressBar,
                  width: `${getUsagePercentage(resource.usage, resource.limit)}%`,
                  backgroundColor: getStatusColor(resource.status)
                }}
              />
            </div>
            <div style={styles.metricDetails}>
              <span>{resource.usage} / {resource.limit} {resource.name === 'Memory' ? 'GB' : 
                     resource.name === 'Disk Space' ? 'GB' : 
                     resource.name === 'Network Bandwidth' ? 'Mbps' : '%'}</span>
              <span style={{ color: getStatusColor(resource.status) }}>{resource.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  contentArea: {
    padding: '20px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  metricTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    color: '#333',
  },
  progressBarContainer: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  metricDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    fontSize: '14px',
    color: '#666',
  },
};

export default ResourcesUsage; 