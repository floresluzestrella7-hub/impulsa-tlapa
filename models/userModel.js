const pool = require('../config/db');

async function createUser({ name, email, password, phone, role }) {
  const [result] = await pool.query(
    'INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)',
    [name, email, password, phone, role]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
  return rows[0];
}

async function getAllUsers() {
  const [rows] = await pool.query('SELECT id,name,email,phone,role,active,created_at FROM users ORDER BY created_at DESC');
  return rows;
}

async function toggleUser(id) {
  await pool.query('UPDATE users SET active = IF(active=1,0,1) WHERE id=?', [id]);
}

module.exports = { createUser, findUserByEmail, getAllUsers, toggleUser };
