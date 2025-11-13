import React from 'react';
import CustomerListItem from './CustomerListItem';

const CustomerList = ({ customers, editingId, editData, onEdit, onDelete, onToggleActive, onSave, onCancel, page, totalPages, setPage }) => {
  return (
    <>
      <ul className="list">
        {customers.map(customer => (
          <CustomerListItem
            key={customer.Id}
            customer={customer}
            isEditing={editingId === customer.Id}
            editData={editData}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            onCancel={onCancel}
          />
        ))}
      </ul>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '16px 0', gap: 8 }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: '6px 12px' }}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              style={{
                padding: '6px 12px',
                fontWeight: page === i + 1 ? 'bold' : 'normal',
                background: page === i + 1 ? '#1976d2' : '#fff',
                color: page === i + 1 ? '#fff' : '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ padding: '6px 12px' }}>Next</button>
        </div>
      )}
    </>
  );
};

export default CustomerList;