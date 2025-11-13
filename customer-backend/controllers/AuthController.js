import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql, poolPromise } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'superrefreshsecretkey';

export async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const pool = await poolPromise;
    // Check duplicate username
    const existing = await pool.request()
      .input('username', sql.VarChar(50), username)
      .query('SELECT 1 AS found FROM Users WHERE username = @username');
    if (existing.recordset && existing.recordset.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    await pool.request()
      .input('username', sql.VarChar(50), username)
      .input('password', sql.VarChar(200), hashed)
      .query('INSERT INTO Users (username, password) VALUES (@username, @password)');
    res.json({ success: true });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.VarChar(50), username)
      .query('SELECT * FROM Users WHERE username = @username');
    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ userId: user.id, username: user.username }, REFRESH_SECRET, { expiresIn: '7d' });
    res.json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
}

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function refresh(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'No refresh token' });
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const newToken = jwt.sign({ userId: payload.userId, username: payload.username }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token: newToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}
