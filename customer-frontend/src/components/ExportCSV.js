import React from 'react';
import './ExportCSV.css';

function convertToCSV(data) {
  const header = ['Name', 'Email', 'Phone', 'Address', 'Date of Birth'];
  const rows = data.map(c => [c.Name, c.Email, c.phone, c.address, c.DateOfBirth]);
  return [header, ...rows].map(row => row.map(v => `"${v || ''}"`).join(',')).join('\n');
}

const ExportCSV = ({ customers }) => {
  const handleExport = () => {
    const csv = convertToCSV(customers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} className="export-csv-btn">
      Export CSV
    </button>
  );
};

export default ExportCSV;
