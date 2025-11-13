import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';

export default function AuthPage({ onAuthenticated }) {
  const [tab, setTab] = useState('login');
  const handleLogin = (token, refreshToken) => {
    try {
      if (token) {
        localStorage.setItem('token', token);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    } catch {}
    onAuthenticated && onAuthenticated(token, refreshToken);
  };

  const handleRegistered = () => {
    setTab('login');
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <h1>Welcome back</h1>
        <p>Sign in to manage your customers, or create an account to get started.</p>
      </div>
      <div className="auth-card">
        <div className="auth-tabs" role="tablist" aria-label="Authentication tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
            role="tab"
            aria-selected={tab === 'login'}
          >
            Login
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
            role="tab"
            aria-selected={tab === 'register'}
          >
            Register
          </button>
        </div>
        <div className="auth-content">
          {tab === 'login' ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Register onRegister={handleRegistered} />
          )}
        </div>
      </div>
    </div>
  );
}
