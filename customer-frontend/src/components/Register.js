import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const api = axios.create({ baseURL: 'http://127.0.0.1:5000' });

export default function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await api.post('/auth/register', { username, password });
      setSuccess(true);
      onRegister && onRegister();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" aria-label="Registration form">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        autoComplete="username"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />
      <button type="submit">Register</button>
      {error && <div className="auth-error" role="alert">{error}</div>}
      {success && <div className="auth-success" role="status">Registration successful!</div>}
    </form>
  );
}
