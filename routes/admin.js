const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUser } = require('../models/userModel');
const { getAllProductsAdmin } = require('../models/productModel');
function admin(req,res,next){ if(!req.session.user || req.session.user.role !== 'admin') return res.redirect('/'); next(); }
router.get('/', admin, async (req,res)=>{
  const users = await getAllUsers();
  const products = await getAllProductsAdmin();
  res.render('admin', { users, products });
});
router.post('/users/toggle/:id', admin, async (req,res)=>{ await toggleUser(req.params.id); res.redirect('/admin'); });
module.exports = router;
