import React, { useState } from 'react';
import Modal from './Modal';

const CustomerForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const isValidEmail = (value) => {
    if (!value) return false;
    // Basic email + domain validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(value)) return false;
    const domain = value.split('@')[1] || '';
    // extra domain checks: no leading/trailing dot and no empty labels
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    if (domain.split('.').some(part => part.length === 0)) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setModalMessage('Please enter a customer name.');
      setModalOpen(true);
      return;
    }
    if (!email || !email.trim()) {
      setModalMessage('Email is required.');
      setModalOpen(true);
      return;
    }
    if (!isValidEmail(email.trim())) {
      setModalMessage('Please enter a valid email address with a valid domain.');
      setModalOpen(true);
      return;
    }
    onAdd({ name, email: email.trim(), phone, address, dob });
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setDob('');
  };

  return (
    <>
  <div className="input-row" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input 
          placeholder="Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          placeholder="Phone (optional)" 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
        />
        <input 
          placeholder="Address (optional)" 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dob}
          onChange={e => setDob(e.target.value)}
          style={{ minWidth: 140 }}
        />
        <button onClick={handleSubmit}>Add</button>
      </div>
  <Modal open={modalOpen} message={modalMessage || 'Invalid input'} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default CustomerForm;