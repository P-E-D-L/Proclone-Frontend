import {render, screen, waitFor} from '@testing-library/react';
import ResourcesUsage from './ResourcesUsage';

// Mock the fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ResourcesUsage', () => {
    // Reset mocks before each test
    beforeEach(() => {
        mockFetch.mockReset();
    });

    test('should display loading message initially', () => {
        // Setup a delayed response to ensure loading state is shown
        mockFetch.mockImplementation(() => new Promise(() => {}));
        
        render(<ResourcesUsage />);
        
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    test('should display resources when API call is successful', async () => {
        const mockResources = [
            { id: 1, name: 'Memory', usage: 80, limit: 100, status: 'Warning' },
            { id: 2, name: 'Disk Space', usage: 120, limit: 100, status: 'Critical' },
            { id: 3, name: 'Network Bandwidth', usage: 50, limit: 100, status: 'Normal' },
        ];
        
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResources,
        });
        
        render(<ResourcesUsage />);
        
        // Wait for loading to disappear
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
        
        // Check if all resource names are displayed
        mockResources.forEach(resource => {
            expect(screen.getByText(resource.name)).toBeInTheDocument();
        });
        
        // Check if usage values are displayed correctly
        expect(screen.getByText('80 / 100 GB')).toBeInTheDocument(); // Memory
        expect(screen.getByText('120 / 100 GB')).toBeInTheDocument(); // Disk Space
        expect(screen.getByText('50 / 100 Mbps')).toBeInTheDocument(); // Network Bandwidth
        
        // Check if status values are displayed
        const normalElements = screen.getAllByText('Normal');
        expect(normalElements.length).toBeGreaterThan(0);
        expect(screen.getByText('Warning')).toBeInTheDocument();
        expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    test('should display error message when API call fails', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));
        
        render(<ResourcesUsage />);
        
        await waitFor(() => {
            expect(screen.getByText(/Failed to load resource metrics/i)).toBeInTheDocument();
        });
    });

    test('should display error message when API returns non-OK response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });
        
        render(<ResourcesUsage />);
        
        await waitFor(() => {
            expect(screen.getByText(/Failed to load resource metrics/i)).toBeInTheDocument();
        });
    });

    test('should handle empty resource array', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });
        
        render(<ResourcesUsage />);
        
        // Wait for loading to disappear
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
        
        // Check that no error is shown
        expect(screen.queryByText(/Failed to load resource metrics/i)).not.toBeInTheDocument();
        
        // Check that the title is still displayed
        expect(screen.getByText(/System Resources/i)).toBeInTheDocument();
    });
});
