import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Import necessary testing utilities from the Testing Library
import TemplateManager from './TemplateManager'; // Import the TemplateManager component to be tested

// Describe block to group the tests for the TemplateManager component
describe('TemplateManager', () => {

    // Test case to check if the TemplateManager component renders correctly
    test('renders the component', () => {
        // Render the TemplateManager component
        render(<TemplateManager />);
        
        // Check if the text "Template Management" is present in the document
        expect(screen.getByText(/Template Management/i)).toBeInTheDocument();
        
        // Check if the text "Available Templates" is present in the document
        expect(screen.getByText(/Available Templates/i)).toBeInTheDocument();
    });
    
    // Test case to verify the empty state when no environments are deployed
    test('shows "No environments currently deployed" when no environments are deployed', () => {
        // Render the TemplateManager component
        render(<TemplateManager />);
        
        // Check if the empty state message "No environments currently deployed" is shown when there are no environments
        expect(screen.getByText(/No environments currently deployed/i)).toBeInTheDocument();
    });
});
