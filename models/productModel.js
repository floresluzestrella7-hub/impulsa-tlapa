const pool = require('../config/db');

async function getCategories() {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
  return rows;
}

async function getProducts(q = '', category = '') {
  let sql = `SELECT p.*, c.name AS category, u.name AS seller, u.phone
             FROM products p
             JOIN categories c ON p.category_id=c.id
             JOIN users u ON p.user_id=u.id
             WHERE p.active=1 AND u.active=1`;
  const params = [];
  if (q) { sql += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  if (category) { sql += ' AND c.id=?'; params.push(category); }
  sql += ' ORDER BY p.created_at DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getMyProducts(userId) {
  const [rows] = await pool.query(`SELECT p.*, c.name AS category FROM products p JOIN categories c ON p.category_id=c.id WHERE p.user_id=? ORDER BY p.created_at DESC`, [userId]);
  return rows;
}

async function createProduct({ user_id, category_id, name, description, price, image }) {
  await pool.query('INSERT INTO products (user_id,category_id,name,description,price,image) VALUES (?,?,?,?,?,?)', [user_id, category_id, name, description, price, image]);
}

async function deleteProduct(id, userId, isAdmin=false) {
  if (isAdmin) await pool.query('UPDATE products SET active=0 WHERE id=?', [id]);
  else await pool.query('UPDATE products SET active=0 WHERE id=? AND user_id=?', [id, userId]);
}

async function getAllProductsAdmin() {
  const [rows] = await pool.query(`SELECT p.*, c.name AS category, u.name AS seller FROM products p JOIN categories c ON p.category_id=c.id JOIN users u ON p.user_id=u.id ORDER BY p.created_at DESC`);
  return rows;
}

module.exports = { getCategories, getProducts, getMyProducts, createProduct, deleteProduct, getAllProductsAdmin };
