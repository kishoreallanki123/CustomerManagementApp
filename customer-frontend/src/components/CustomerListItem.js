import React from 'react';
import './CustomerListItem.css';

const CustomerListItem = ({ customer, onEdit, onDelete, onToggleActive, isEditing, editData, onSave, onCancel }) => {
  if (isEditing) {
    return (
      <li className="list-item">
        <input 
          value={editData.name} 
          onChange={e => editData.setName(e.target.value)} 
          placeholder="Name"
        />
        <input 
          value={editData.email} 
          onChange={e => editData.setEmail(e.target.value)} 
          placeholder="Email"
        />
        <input 
          value={editData.phone} 
          onChange={e => editData.setPhone(e.target.value)} 
          placeholder="Phone"
        />
        <input 
          value={editData.address} 
          onChange={e => editData.setAddress(e.target.value)} 
          placeholder="Address"
        />
        <input
          type="date"
          value={editData.dob || ''}
          onChange={e => editData.setDob(e.target.value)}
          placeholder="Date of Birth"
          style={{ minWidth: 140 }}
        />
        <div className="edit-actions">
          <button className="btn-primary" onClick={() => onSave(customer.Id)}>Save</button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </li>
    );
  }

  function formatDOB(dob) {
    if (!dob) return '—';
    const date = new Date(dob);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  return (
    <li className="list-item">
      <div>
        <div className="cust-name"><strong>Name:</strong> {customer.Name}</div>
        <div className="cust-email"><strong>Email:</strong> {customer.Email || '—'}</div>
  <div className="cust-phone"><strong>Phone:</strong> {customer.Phone || customer.phone || '—'}</div>
  <div className="cust-address"><strong>Address:</strong> {customer.Address || customer.address || '—'}</div>
        <div className="cust-dob"><strong>Date of Birth:</strong> {formatDOB(customer.DateOfBirth)}</div>
      </div>
      <div>
        <button className="btn-edit" onClick={() => onEdit(customer)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(customer.Id)}>Delete</button>
      </div>
    </li>
  );
};

export default CustomerListItem;