/**
 * Tests for the ResourcesUsage component which displays system resource metrics.
 * This test suite covers loading states, successful data fetching, error handling,
 * and edge cases for the component.
 */

import {render, screen, waitFor} from '@testing-library/react';
import ResourcesUsage from './ResourcesUsage';

// Mock the global fetch API to control network responses in tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

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
        // Mock data representing different resource types with various statuses
        const mockResources = [
            { id: 1, name: 'Memory', usage: 80, limit: 100, status: 'Warning' },
            { id: 2, name: 'Disk Space', usage: 120, limit: 100, status: 'Critical' },
            { id: 3, name: 'Network Bandwidth', usage: 50, limit: 100, status: 'Normal' },
        ];
        
        // Mock successful API response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResources,
        });
        
        render(<ResourcesUsage />);
        
        // Verify loading state is removed
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
        
        // Verify all resource names are displayed
        mockResources.forEach(resource => {
            expect(screen.getByText(resource.name)).toBeInTheDocument();
        });
        
        // Verify usage values are formatted and displayed correctly
        expect(screen.getByText('80 / 100 GB')).toBeInTheDocument(); // Memory
        expect(screen.getByText('120 / 100 GB')).toBeInTheDocument(); // Disk Space
        expect(screen.getByText('50 / 100 Mbps')).toBeInTheDocument(); // Network Bandwidth
        
        // Verify status indicators are displayed correctly
        const normalElements = screen.getAllByText('Normal');
        expect(normalElements.length).toBeGreaterThan(0);
        expect(screen.getByText('Warning')).toBeInTheDocument();
        expect(screen.getByText('Critical')).toBeInTheDocument();
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
    test('should handle empty resource array', async () => {
        // Mock successful API response with empty data
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
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
    });
});
