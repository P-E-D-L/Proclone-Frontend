import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // For routing support in tests
import LoginPage from './LoginPage';
import * as Cookies from 'js-cookie';  // Make sure to import the Cookies module

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('js-cookie', () => ({
  set: jest.fn(),  // Mock `Cookies.set` method
  get: jest.fn(),
  remove: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Check if the input fields and button are rendered
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('shows an error when username or password is empty', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Check if error message appears
    expect(screen.getByText('Username and password are required')).toBeInTheDocument();
  });

  test('shows an error for invalid credentials', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wrongUser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongPass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    // Check if error message for invalid credentials appears
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });

  test('redirects and sets cookies on successful login', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    // Check if cookies and localStorage are set
    expect(Cookies.set).toHaveBeenCalledWith('authCookieTest', 'true', { expires: 0 });
    expect(localStorage.getItem('isAuthenticated')).toBe('true');

    // Check if it navigates to the admin panel ("/")
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
