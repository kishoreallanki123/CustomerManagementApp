import React, { useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import './AnalyticsCharts.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

function monthKey(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

function parseActive(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const s = value.trim().toLowerCase();
    return s === '1' || s === 'true' || s === 'y' || s === 'yes' || s === 'active';
  }
  return false;
}

export default function AnalyticsCharts({ customers = [] }) {
  const [activeOnly, setActiveOnly] = useState(false);

  const filtered = useMemo(() => {
    if (!activeOnly) return customers;
    return customers.filter(c => parseActive(c.IsActive ?? c.isActive ?? c.Active ?? c.active));
  }, [customers, activeOnly]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const withEmail = filtered.filter(c => (c.Email || '').toString().trim()).length;
    const withPhone = filtered.filter(c => (c.Phone || c.phone || '').toString().trim()).length;
    const withAddress = filtered.filter(c => (c.Address || c.address || '').toString().trim()).length;
    const active = filtered.filter(c => parseActive(c.IsActive ?? c.isActive ?? c.Active ?? c.active)).length;
    const inactive = total - active;

    // Last 6 months additions based on CreatedAt/createdAt fields
    const now = new Date();
    const months = [];
    const counts = [];
    const map = new Map();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));
      map.set(monthKey(d), 0);
    }
    filtered.forEach(c => {
      const ts = c.CreatedAt || c.createdAt || null;
      const dt = ts ? new Date(ts) : null;
      if (!dt || isNaN(dt.getTime())) return;
      const key = monthKey(new Date(dt.getFullYear(), dt.getMonth(), 1));
      if (map.has(key)) map.set(key, map.get(key) + 1);
    });
    map.forEach(v => counts.push(v));

    return { total, withEmail, withPhone, withAddress, active, inactive, months, counts };
  }, [filtered]);

  const doughnutData = {
    labels: ['With Email', 'With Phone', 'With Address'],
    datasets: [
      {
        label: 'Availability',
        data: [stats.withEmail, stats.withPhone, stats.withAddress],
        backgroundColor: ['#1976d2', '#22c55e', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: stats.months,
    datasets: [
      {
        label: 'New Customers',
        data: stats.counts,
        backgroundColor: 'rgba(25, 118, 210, 0.85)',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Monthly Additions (last 6 months)' },
    },
    scales: {
      y: { beginAtZero: true, precision: 0, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="analytics-grid">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <div style={{ display: 'inline-flex', background: 'var(--tabs-bg,#f1f5f9)', border: '1px solid var(--border-color,#e2e8f0)', borderRadius: 10, overflow: 'hidden' }}>
          <button
            onClick={() => setActiveOnly(false)}
            style={{ padding: '8px 12px', border: 'none', background: activeOnly ? 'transparent' : '#fff', cursor: 'pointer', fontWeight: !activeOnly ? 600 : 500 }}
          >All</button>
          <button
            onClick={() => setActiveOnly(true)}
            style={{ padding: '8px 12px', border: 'none', background: activeOnly ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: activeOnly ? 600 : 500 }}
          >Active only</button>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="kpi-title">Total</div><div className="kpi-value">{stats.total}</div></div>
        <div className="kpi"><div className="kpi-title">With Email</div><div className="kpi-value">{stats.withEmail}</div></div>
        <div className="kpi"><div className="kpi-title">With Phone</div><div className="kpi-value">{stats.withPhone}</div></div>
        <div className="kpi"><div className="kpi-title">With Address</div><div className="kpi-value">{stats.withAddress}</div></div>
        <div className="kpi"><div className="kpi-title">Active</div><div className="kpi-value">{stats.active}</div></div>
        <div className="kpi"><div className="kpi-title">Inactive</div><div className="kpi-value">{stats.inactive}</div></div>
      </div>
      <div className="chart-row">
        <div className="chart-card"><Bar data={barData} options={barOptions} /></div>
        <div className="chart-card"><Doughnut data={doughnutData} /></div>
      </div>
    </div>
  );
}
