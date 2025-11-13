// controllers/CustomerController.js
import { sql, poolPromise } from '../db.js';
// Removed erroneous React import; backend controllers must not import frontend libraries.

class CustomerController {
  // GET /customers
  async getAll(req, res) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      // Support optional filtering via query param ?onlyActive=1|0|true|false|all
      const { onlyActive } = req.query || {};
      if (onlyActive === '1' || onlyActive === 'true') {
        request.input('OnlyActive', sql.Bit, 1);
      } else if (onlyActive === '0' || onlyActive === 'false') {
        request.input('OnlyActive', sql.Bit, 0);
      } else {
        // Explicitly pass NULL to return all when not specified or set to 'all'
        request.input('OnlyActive', sql.Bit, null);
      }
      const result = await request.execute('usp_GetAllCustomers');
      res.json(result.recordset);
    } catch (err) {
      console.error('GetAll error', err);
      res.status(500).json({ error: err.message });
    }
  }

  // POST /customers
  async create(req, res) {
  const { name, email, phone, address, dob } = req.body;
  const dobValue = dob && dob.trim() ? dob : null;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name required' });
    if (!email || !email.toString().trim()) return res.status(400).json({ error: 'Email required' });
    const emailStr = email.toString().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const domain = emailStr.split('@')[1] || '';
    if (!emailRegex.test(emailStr) || domain.startsWith('.') || domain.endsWith('.') || domain.split('.').some(p => p.length === 0)) {
      return res.status(400).json({ error: 'Invalid email domain' });
    }
    try {
      const pool = await poolPromise;
      const request = pool.request();
  request.input('Name', sql.NVarChar(200), name);
  request.input('Email', sql.NVarChar(200), email || null);
  request.input('phone', sql.VarChar(20), phone || null);
  request.input('address', sql.VarChar(200), address || null);
  request.input('DateOfBirth', sql.Date, dobValue || null);
      const result = await request.execute('usp_InsertCustomer');
      const newId = result.recordset?.[0]?.NewId;
      res.status(201).json({ id: newId, name, email, phone, address, dob });
    } catch (err) {
      console.error('Create error', err);
      res.status(500).json({ error: err.message });
    }
  }

  // PUT /customers/:id
  async update(req, res) {
  const { id } = req.params;
  const { name, email, phone, address, dob, IsActive } = req.body;
  const dobValue = dob && dob.trim() ? dob : null;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name required' });
    if (!email || !email.toString().trim()) return res.status(400).json({ error: 'Email required' });
    const emailStr = email.toString().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const domain = emailStr.split('@')[1] || '';
    if (!emailRegex.test(emailStr) || domain.startsWith('.') || domain.endsWith('.') || domain.split('.').some(p => p.length === 0)) {
      return res.status(400).json({ error: 'Invalid email domain' });
    }
    try {
      const pool = await poolPromise;
      const request = pool.request();
  request.input('Id', sql.Int, Number(id));
  request.input('Name', sql.NVarChar(200), name);
  request.input('Email', sql.NVarChar(200), email || null);
  request.input('phone', sql.VarChar(20), phone || null);
  request.input('address', sql.VarChar(200), address || null);
  request.input('DateOfBirth', sql.Date, dobValue || null);
  request.input('IsActive', sql.Bit, IsActive || null);
      // Log all parameters for debugging
      console.log('Update params:', { Id: Number(id), Name: name, Email: email || null, Phone: phone || null, Address: address || null, DateOfBirth: dob || null, IsActive: IsActive || null, body: req.body });
      const result = await request.execute('usp_UpdateCustomer');
      const changed = result.recordset?.[0]?.RowsAffected;
      res.json({ updated: changed });
    } catch (err) {
      console.error('Update error', err);
      res.status(500).json({ error: err.message });
    }
  }

  // DELETE /customers/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const pool = await poolPromise;
      const request = pool.request();
      request.input('Id', sql.Int, Number(id));
      const result = await request.execute('usp_DeleteCustomer');
      const removed = result.recordset?.[0]?.RowsAffected;
      res.json({ deleted: removed });
    } catch (err) {
      console.error('Delete error', err);
      res.status(500).json({ error: err.message });
    }
  }
}

export default new CustomerController();
