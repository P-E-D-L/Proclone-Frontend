/**
 * Tests for the ResourcesUsage component which displays system resource metrics.
 * This test suite covers loading states, successful data fetching, error handling,
 * and edge cases for the component.
 */

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import ResourcesUsage from './ResourcesUsage';

// Mock the global fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock data matching the new data structure
const mockResourceResponse = {
    nodes: [
        {
            node_name: 'node1',
            cpu_usage: 80,
            memory_total: 16000000000, // 16GB
            memory_used: 12000000000,  // 12GB
            storage_total: 1000000000000, // 1TB
            storage_used: 500000000000,   // 500GB
        },
        {
            node_name: 'node2',
            cpu_usage: 60,
            memory_total: 32000000000, // 32GB
            memory_used: 16000000000,  // 16GB
            storage_total: 2000000000000, // 2TB
            storage_used: 1000000000000,   // 1TB
        }
    ],
    cluster: {
        total_cpu_usage: 70,
        total_memory_total: 48000000000, // 48GB
        total_memory_used: 28000000000,  // 28GB
        total_storage_total: 3000000000000, // 3TB
        total_storage_used: 1500000000000,   // 1.5TB
    }
};

describe('ResourcesUsage', () => {
    // Reset mock implementations before each test to ensure clean state
    beforeEach(() => {
        mockFetch.mockReset();
    });

    /**
     * Test initial loading state
     * Verifies that the component shows a loading message while fetching data
     */
    test('should display loading message initially', () => {
        // Setup a delayed response to ensure loading state is shown
        mockFetch.mockImplementation(() => new Promise(() => {}));
        
        render(<ResourcesUsage />);
        
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    /**
     * Test successful data fetching and display
     * Verifies that the component correctly renders resource metrics
     * including usage values, limits, and status indicators
     */
    test('should display resources when API call is successful', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResourceResponse,
        });
        
        render(<ResourcesUsage />);
        
        // Verify loading state is removed
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
        
        // Verify cluster overview section
        expect(screen.getByText('Cluster Overview')).toBeInTheDocument();
        expect(screen.getByText('70.00%')).toBeInTheDocument(); // CPU usage
        expect(screen.getByText('28.00 GB / 48.00 GB')).toBeInTheDocument(); // Memory
        expect(screen.getByText('1.50 TB / 3.00 TB')).toBeInTheDocument(); // Storage
        
        // Verify node details section
        expect(screen.getByText('Node Details')).toBeInTheDocument();
        
        // Verify node1 details
        expect(screen.getByText('node1')).toBeInTheDocument();
        expect(screen.getByText('80.00%')).toBeInTheDocument(); // CPU
        expect(screen.getByText('12.00 GB / 16.00 GB')).toBeInTheDocument(); // Memory
        expect(screen.getByText('500.00 GB / 1.00 TB')).toBeInTheDocument(); // Storage
        
        // Verify node2 details
        expect(screen.getByText('node2')).toBeInTheDocument();
        expect(screen.getByText('60.00%')).toBeInTheDocument(); // CPU
        expect(screen.getByText('16.00 GB / 32.00 GB')).toBeInTheDocument(); // Memory
        expect(screen.getByText('1.00 TB / 2.00 TB')).toBeInTheDocument(); // Storage
    });

    /**
     * Test network error handling
     * Verifies that the component displays an error message when the API call fails
     */
    test('should display error message when API call fails', async () => {
        // Mock a network error
        mockFetch.mockRejectedValueOnce(new Error('Network error'));
        
        render(<ResourcesUsage />);
        
        await waitFor(() => {
            expect(screen.getByText(/Failed to load resource metrics/i)).toBeInTheDocument();
        });
    });

    /**
     * Test non-OK API response handling
     * Verifies that the component displays an error message when the API returns
     * a non-200 status code
     */
    test('should display error message when API returns non-OK response', async () => {
        // Mock a failed API response with 500 status
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });
        
        render(<ResourcesUsage />);
        
        await waitFor(() => {
            expect(screen.getByText(/Failed to load resource metrics/i)).toBeInTheDocument();
        });
    });

    /**
     * Test empty data handling
     * Verifies that the component handles an empty resource array gracefully
     * and still displays the component title
     */
    test('should handle empty data response', async () => {
        // Mock successful API response with empty data
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                nodes: [],
                cluster: {
                    total_cpu_usage: 0,
                    total_memory_total: 0,
                    total_memory_used: 0,
                    total_storage_total: 0,
                    total_storage_used: 0,
                }
            }),
        });
        
        render(<ResourcesUsage />);
        
        // Verify loading state is removed
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
        
        // Verify no error is shown for empty data
        expect(screen.queryByText(/Failed to load resource metrics/i)).not.toBeInTheDocument();
        
        // Verify component title is still displayed
        expect(screen.getByText(/System Resources/i)).toBeInTheDocument();
        expect(screen.getByText('Cluster Overview')).toBeInTheDocument();
        expect(screen.getByText('Node Details')).toBeInTheDocument();
    });
});