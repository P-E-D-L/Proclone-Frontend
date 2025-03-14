import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPanel from './AdminPanel'; // Adjust the import path as necessary
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

// Mock the dayjs library to return a fixed date/time
jest.mock('dayjs', () => () => ({
  format: jest.fn().mockReturnValue('January 1, 2023 12:00 PM'),
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('AdminPanel Component', () => {
  it('renders the AdminPanel component', () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    // Check if the AdminPanel title is rendered
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('renders the Sidebar component with navigation links', () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    // Check if the navigation links are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('displays the current date and time', () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    // Check if the date/time container is rendered
    const dateTimeContainer = screen.getByText(/Current Date & Time:/i);
    expect(dateTimeContainer).toBeInTheDocument();

    // Check if the mocked date/time is displayed
    const dateTimeText = screen.getByText(/January 1, 2023 12:00 PM/i);
    expect(dateTimeText).toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    // Mock localStorage
    Storage.prototype.removeItem = jest.fn();

    // Create a mock navigate function
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    // Click the logout button
    fireEvent.click(screen.getByText('Logout'));

    // Check if localStorage.removeItem was called
    expect(localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});