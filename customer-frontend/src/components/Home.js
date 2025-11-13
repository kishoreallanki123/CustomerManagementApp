import React from 'react';
import './Home.css';

const Home = ({ customers = [] }) => {
  const total = customers.length;
  const withEmail = customers.filter(c => !!(c.Email)).length;
  const withoutEmail = total - withEmail;
  const recent = [...customers]
    .sort((a, b) => new Date(b.CreatedAt || b.createdAt || 0) - new Date(a.CreatedAt || a.createdAt || 0))
    .slice(0, 6);

  return (
    <div className="home-dashboard">
      <div className="home-hero card">
        <div className="hero-content">
          <h2>Welcome back</h2>
          <p className="hero-sub">Overview of your customers and recent activity</p>
        </div>
        <div className="hero-illustration" aria-hidden>
          {/* Simple professional SVG illustration */}
          <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="220" height="120" rx="8" fill="#0ea5a4" opacity="0.08"/>
            <g transform="translate(12,20)">
              <rect x="0" y="48" width="20" height="32" rx="3" fill="#06b6d4"/>
              <rect x="30" y="30" width="20" height="50" rx="3" fill="#0891b2"/>
              <rect x="60" y="10" width="20" height="70" rx="3" fill="#0ea5a4"/>
              <rect x="90" y="22" width="20" height="58" rx="3" fill="#14b8a6"/>
              <rect x="120" y="40" width="20" height="40" rx="3" fill="#06b6d4"/>
            </g>
          </svg>
        </div>
      </div>

      <div className="metrics">
        <div className="metric-card">
          <div className="metric-title">Total</div>
          <div className="metric-value">{total}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">With Email</div>
          <div className="metric-value">{withEmail}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Without Email</div>
          <div className="metric-value">{withoutEmail}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Recent Adds</div>
          <div className="metric-value">{recent.length}</div>
        </div>
      </div>

      <div className="recent-card card">
        <h3>Recently added</h3>
        <ul className="recent-list">
          {recent.length ? recent.map(c => (
            <li key={c.Id ?? c.id} className="recent-item">
              <div className="recent-info">
                <div className="recent-name">{c.Name}</div>
                <div className="recent-email">{c.Email || '—'}</div>
              </div>
              <div className="recent-date">
                {new Date(c.CreatedAt || c.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </li>
          )) : <li className="no-recent">No recent customers</li>}
        </ul>
      </div>
    </div>
  );
};

export default Home;