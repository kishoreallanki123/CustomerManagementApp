// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerForm from './components/CustomerForm';
import ExportCSV from './components/ExportCSV';
import ImportCSV from './components/ImportCSV';
import SearchFilter from './components/SearchFilter';
import CustomerList from './components/CustomerList';
import './App.css';
import SideMenu from './components/SideMenu';
import Home from './components/Home';
import AuthPage from './components/AuthPage';
import AnalyticsCharts from './components/AnalyticsCharts';
import ConfirmDialog from './components/ConfirmDialog';
import Modal from './components/Modal';
// import Login from './components/Login';
// import Register from './components/Register';
// import AnalyticsCharts from './components/AnalyticsCharts';


const api = axios.create({ baseURL: 'http://127.0.0.1:5000' });

function App() {
  // Dark mode state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const [customers, setCustomers] = useState([]);
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('token') || ''; } catch { return ''; }
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    try { return localStorage.getItem('refreshToken') || ''; } catch { return ''; }
  });
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  // Start on auth if no token
  const [activeTab, setActiveTab] = useState(() => token ? 'home' : 'auth');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalMessage, setEditModalMessage] = useState('');
  // Attach token to API requests when available
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Axios 401 interceptor to refresh token automatically
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (resp) => resp,
      async (error) => {
        const original = error.config;
        if (error.response && error.response.status === 401 && !original._retry && refreshToken) {
          original._retry = true;
          try {
            const r = await api.post('/auth/refresh', { refreshToken });
            const newToken = r.data?.token;
            if (newToken) {
              setToken(newToken);
              try { localStorage.setItem('token', newToken); } catch {}
              api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
              return api(original);
            }
          } catch (e) {
            // fall through to logout below
          }
          // Refresh failed: force logout
          try { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); } catch {}
          setToken('');
          setRefreshToken('');
          setActiveTab('auth');
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [refreshToken]);
  // Removed authentication state
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchCustomers = async () => {
    try {
      // Explicitly request all customers (active + inactive)
      const res = await api.get('/customers', { params: { onlyActive: 'all' } });
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch customers', err);
      setCustomers([]);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleAddCustomer = async ({ name, email, phone, address, dob }) => {
    await api.post('/customers', { name, email, phone, address, dob });
    fetchCustomers();
  };

  const [editDob, setEditDob] = useState('');
  const handleEdit = (customer) => {
    setEditingId(customer.Id);
    setEditName(customer.Name || '');
    setEditEmail(customer.Email || '');
    setEditPhone(customer.Phone ?? customer.phone ?? '');
    setEditAddress(customer.Address ?? customer.address ?? '');
    setEditDob(customer.DateOfBirth ? customer.DateOfBirth.slice(0, 10) : '');
    const activeVal = customer.IsActive ?? customer.isActive ?? customer.Active ?? customer.active;
    const activeBool = (typeof activeVal === 'boolean')
      ? activeVal
      : (activeVal === 1 || activeVal === '1' || (typeof activeVal === 'string' && activeVal.toLowerCase() === 'true'));
    setEditIsActive(activeBool);
  };

  const validateEmail = (value) => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(value)) return false;
    const domain = value.split('@')[1] || '';
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    if (domain.split('.').some(part => part.length === 0)) return false;
    return true;
  };

  const handleSave = async (id) => {
    if (!editName.trim()) {
      setEditModalMessage('Please enter a customer name.');
      setEditModalOpen(true);
      return;
    }
    if (!editEmail || !editEmail.trim()) {
      setEditModalMessage('Email is required.');
      setEditModalOpen(true);
      return;
    }
    if (!validateEmail(editEmail.trim())) {
      setEditModalMessage('Please enter a valid email address with a valid domain.');
      setEditModalOpen(true);
      return;
    }
    await api.put(`/customers/${id}`, { 
      name: editName, 
      email: editEmail.trim(),
      phone: editPhone,
      address: editAddress,
      dob: editDob,
      IsActive: editIsActive
    });
    setEditingId(null);
    setEditPhone('');
    setEditAddress('');
    setEditDob('');
    fetchCustomers();
  };

  const handleToggleActive = async (id, newActiveState) => {
    try {
      const customer = customers.find(c => c.Id === id);
      const isActiveValue = newActiveState ? 1 : 0;
      console.log('Toggling active status:', { id, name: customer?.Name, email: customer?.Email, IsActive: isActiveValue });
      await api.put(`/customers/${id}`, { 
        name: customer?.Name,
        email: customer?.Email,
        IsActive: isActiveValue
      });
      fetchCustomers();
    } catch (err) {
      console.error('Failed to toggle active status', err);
      alert('Failed to update active status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    await api.delete(`/customers/${id}`);
    fetchCustomers();
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const searchTermLower = (searchTerm || '').trim().toLowerCase();

  const filteredCustomers = customers.filter(customer => {
    const name = (customer.Name || '').toString().toLowerCase();
    const email = (customer.Email || '').toString().toLowerCase();
    const phone = (customer.phone || '').toString().toLowerCase();
    const address = (customer.address || '').toString().toLowerCase();
    const matchesSearch = !searchTermLower
      || name.includes(searchTermLower)
      || email.includes(searchTermLower)
      || phone.includes(searchTermLower)
      || address.includes(searchTermLower);

    if (!matchesSearch) return false;
    if (filterBy === 'withEmail') return !!(customer.Email && customer.Email.toString().trim());
    if (filterBy === 'withoutEmail') return !(customer.Email && customer.Email.toString().trim());
    return true;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'created') {
      const aTime = new Date(a.CreatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.CreatedAt || b.createdAt || 0).getTime();
      return (aTime - bTime) * order;
    }
    const key = sortBy === 'name' ? 'Name' : 'Email';
    const aValue = (a[key] || '').toString();
    const bValue = (b[key] || '').toString();
    return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' }) * order;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedCustomers.length / pageSize);
  const paginatedCustomers = sortedCustomers.slice((page - 1) * pageSize, page * pageSize);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Attach token to API requests
  // Removed token attachment

  return (
    <div className="app-container">
      <SideMenu 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isAuthenticated={!!token}
        onLogout={() => setShowLogoutConfirm(true)}
      />
      <main className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <ConfirmDialog
          open={showLogoutConfirm}
          title="Log out?"
          message="You will be signed out of your session and returned to the Sign In page."
          confirmText="Log out"
          cancelText="Cancel"
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            setShowLogoutConfirm(false);
            try { localStorage.removeItem('token'); } catch {}
            try { localStorage.removeItem('refreshToken'); } catch {}
            setToken('');
            setRefreshToken('');
            setActiveTab('auth');
          }}
        />
        <Modal
          open={editModalOpen}
          message={editModalMessage}
          onClose={() => setEditModalOpen(false)}
        />
        {activeTab === 'home' && token && (
          <div className="app">
            <Home customers={customers} />
          </div>
        )}
        {activeTab === 'customers' && token && (
          <div className="app">
            <h1>Customer Management</h1>
            <div className="card">
              <CustomerForm onAdd={handleAddCustomer} />
              {/* Moved ExportCSV and ImportCSV below pagination */}
              <SearchFilter
                searchTerm={searchTerm}
                filterBy={filterBy}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSearchChange={setSearchTerm}
                onFilterChange={setFilterBy}
                onSortChange={handleSort}
              />
              <CustomerList
                customers={paginatedCustomers}
                editingId={editingId}
                editData={{ 
                  name: editName, 
                  email: editEmail, 
                  phone: editPhone,
                  address: editAddress,
                  dob: editDob,
                  setName: setEditName, 
                  setEmail: setEditEmail,
                  setPhone: setEditPhone,
                  setAddress: setEditAddress,
                  setDob: setEditDob,
                  isActive: editIsActive,
                  setIsActive: setEditIsActive
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
              {/* Export/Import CSV buttons below pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 0 0', gap: 12 }}>
                <div>
                  <ExportCSV customers={customers} />
                </div>
                <div>
                  <ImportCSV onImport={async imported => {
                    for (const c of imported) {
                      await api.post('/customers', {
                        name: c.Name || c.name,
                        email: c.Email || c.email,
                        phone: c.Phone || c.phone,
                        address: c.Address || c.address
                      });
                    }
                    fetchCustomers();
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'auth' && !token && (
          <div className="app">
            <AuthPage onAuthenticated={(t, rt) => { 
              setToken(t || ''); 
              setRefreshToken(rt || ''); 
              setActiveTab('home'); 
            }} />
          </div>
        )}
        {activeTab === 'analytics' && token && (
          <div className="app">
            <h1>Analytics</h1>
            <div className="card">
              <AnalyticsCharts customers={customers} />
            </div>
          </div>
        )}
        {activeTab === 'settings' && token && (
          <div className="app">
            <h1>Settings</h1>
            <div className="card">
              <h2 style={{marginBottom:16}}>Theme</h2>
              <button
                style={{padding:'8px 16px',borderRadius:8,border:'none',background:'#1976d2',color:'#fff',fontWeight:600,cursor:'pointer'}}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>
          </div>
        )}
        {/* Add more tab content as needed */}
      </main>
    </div>
  );
}

export default App;
