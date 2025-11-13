import React from 'react';

const Modal = ({ open, message, onClose }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: '24px 32px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
        minWidth: 300,
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ fontSize: 18, color: '#f44336', fontWeight: 'bold', marginBottom: 12 }}>{message}</div>
        <button onClick={onClose} style={{
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '8px 20px',
          fontSize: 16,
          cursor: 'pointer',
        }}>OK</button>
      </div>
    </div>
  );
};

export default Modal;
