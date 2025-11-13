import React from 'react';
import './SearchFilter.css';

const SearchFilter = ({ 
  searchTerm, 
  filterBy, 
  sortBy,
  sortOrder,
  onSearchChange, 
  onFilterChange,
  onSortChange 
}) => {
  return (
    <div className="search-filter-container">
      <input 
        className="search-input"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
      />
      <select 
        className="filter-select"
        value={filterBy}
        onChange={e => onFilterChange(e.target.value)}
      >
        <option value="all">All Customers</option>
        <option value="withEmail">With Email</option>
        <option value="withoutEmail">Without Email</option>
      </select>
      <select
        className="sort-select"
        value={`${sortBy}-${sortOrder}`}
        onChange={e => {
          const [field, order] = e.target.value.split('-');
          onSortChange(field, order);
        }}
      >
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="email-asc">Email (A-Z)</option>
        <option value="email-desc">Email (Z-A)</option>
        <option value="created-desc">Newest First</option>
        <option value="created-asc">Oldest First</option>
      </select>
    </div>
  );
};

export default SearchFilter;