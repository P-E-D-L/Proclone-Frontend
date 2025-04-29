import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from './kaminoLogo.png'; // Replace with the actual path

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
        // Confirm session is valid before redirecting
        const sessionCheck = await fetch('/api/session', { credentials: 'include' });
        const data = await sessionCheck.json();
        setError('');

        if (data.isAdmin) {
          navigate('/admin');
        } else if (!data.isAdmin) {
          navigate('/dashboard');
        } else {
          setError('Login succeeded but session was not established.');
          console.warn('Session check failed after login');
        }
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

    // return (
  //   <div style={styles.pageContainer}>
  //     <div style={styles.container}>
  //       <h2 style={styles.title}>Welcome Back</h2>
  //       <p style={styles.subtitle}>Please sign in to continue</p>
  //       <form onSubmit={handleSubmit} style={styles.form}>
  //         <div style={styles.formGroup}>
  //           <input
  //             type="text"
  //             id="username"
  //             name="username"
  //             placeholder="Username"
  //             value={formData.username}
  //             onChange={handleChange}
  //             style={styles.input}
  //           />
  //         </div>
  //         <div style={styles.formGroup}>
  //           <input
  //             type="password"
  //             id="password"
  //             name="password"
  //             placeholder="Password"
  //             value={formData.password}
  //             onChange={handleChange}
  //             style={styles.input}
  //           />
  //         </div>
  //         {error && <div style={styles.error}>{error}</div>}
  //         <button type="submit" style={styles.submitButton}>
  //           Sign In
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );
  //};

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginContainer}>
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.loginButton}>
            LOGIN
          </button>
          </form>
        </div>
      <div style={styles.logoContainer}>
      <img src={logo} alt="Logo" style={{ ...styles.logo, height: 'auto' }} />
        <p style={styles.appDescription}>
        <h2>Deploy & Destroy</h2>
        This application empowers you to rapidly spin up and delete Proxmox templates hosted on the SDC.
        </p>
      </div>
      <div style={styles.footer}>Property of Cal Poly Pomona Student Data Center</div>
    </div>
  );
};

  const styles: { [key: string]: CSSProperties } = {
    pageContainer: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      alignItems: 'stretch', // Change this to stretch
      justifyContent: 'center',
      flexDirection: 'row', // Arrange left and right containers horizontally
      fontFamily: 'Canvas Sans, sans-serif',
    },
    logoContainer: {
      backgroundColor: '#ffffff',
      padding: '40px',
      width: '45%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    loginContainer: {
      backgroundColor: '#cecece',
      padding: '20px',
      minWidth: '30%',
      maxWidth: '100px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: '350px',
      maxWidth: '80%',
      height: '80px',
      marginBottom: '20px',
    },
    appName: {
      fontSize: '2.5em',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    appDescription: {
      color: '#666',
      lineHeight: '1.6',
      width: '500px',
      maxWidth: '90%',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      width: '100%',
      alignItems: 'center',
    },
    input: {
      padding: '12px 16px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '30px',
      boxSizing: 'border-box',
      textAlign: 'center',
      width: '250px',
      maxWidth: '95%',
    },
    loginButton: {
      backgroundColor: '#414141',
      color: 'white',
      padding: '14px 20px',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '250px',
      maxWidth: '95%',
    },
    signUpButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '12px 18px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    error: {
      color: '#dc3545',
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '10px',
    },
    footer: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      backgroundColor: '#414141',
      color: '#fff',
      textAlign: 'center',
      padding: '10px 0',
      fontSize: '0.8em',
    },
  };

export default LoginPage;
