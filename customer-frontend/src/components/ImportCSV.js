import './ImportCSV.css';
import React, { useRef } from 'react';

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const [header, ...rows] = lines.map(line => line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(v => v.replace(/(^"|"$)/g, '')));
  return rows.map(row => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key.trim()] = row[i] || '';
    });
    return obj;
  });
}

const ImportCSV = ({ onImport }) => {
  const fileInput = useRef();

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const customers = parseCSV(evt.target.result);
      onImport(customers);
    };
    reader.readAsText(file);
    fileInput.current.value = '';
  };

  return (
    <>
      <button
        type="button"
        className="import-csv-btn"
        onClick={() => fileInput.current.click()}
      >
        Import CSV
      </button>
      <input
        id="import-csv"
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        ref={fileInput}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImportCSV;
