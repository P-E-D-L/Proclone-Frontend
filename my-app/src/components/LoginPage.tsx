import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie library

// Function to set a session cookie
const setSessionCookie = (name: string, value: string) => {
  Cookies.set(name, value, { expires: 0 }); // create session cookie
};


interface FormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
  const [error, setError] = useState<string>('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.username === '' || formData.password === '') {
      setError('Username and password are required');
      return;
    }
  
    try {
      // Send request to backend for authentication
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending/receiving cookies
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
  
      // Handle the response based on the status
      if (response.ok) {
        setError('');
        setSessionCookie('authCookieTest', 'true'); // You can store a real session cookie if your backend sets it
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/'); // Redirect to admin panel
      } else if (response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Please sign in to continue</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.submitButton}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: '600' as const,
    color: '#333',
    textAlign: 'center' as const,
  },
  subtitle: {
    margin: '0 0 30px 0',
    color: '#666',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    transition: 'border-color 0.2s',
    outline: 'none',
    '&:focus': {
      borderColor: '#007bff',
    },
  },
  submitButton: {
    padding: '14px 20px',
    fontSize: '16px',
    fontWeight: '500' as const,
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    textAlign: 'center' as const,
    margin: '-10px 0',
  },
};

export default LoginPage;
