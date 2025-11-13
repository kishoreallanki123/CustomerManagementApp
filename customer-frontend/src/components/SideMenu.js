import React from 'react';
import './SideMenu.css';

const SideMenu = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse, isAuthenticated, onLogout }) => {
  const authedItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'help', label: 'Help & Support', icon: '❔' }
  ];
  const guestItems = [
    { id: 'auth', label: 'Sign In', icon: '🔐' }
  ];
  const menuItems = isAuthenticated ? authedItems : guestItems;

  return (
    <div className={`side-menu ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="menu-header">
        <h2>CRM System</h2>
        <button className="collapse-btn" onClick={onToggleCollapse}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="menu-items">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
        {isAuthenticated && (
          <button
            className={`menu-item ${activeTab === 'logout' ? 'active' : ''}`}
            onClick={() => onLogout && onLogout()}
          >
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Log out</span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default SideMenu;