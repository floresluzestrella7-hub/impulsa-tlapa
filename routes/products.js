const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getCategories, getMyProducts, createProduct, deleteProduct } = require('../models/productModel');

function auth(req,res,next){ if(!req.session.user) return res.redirect('/auth/login'); next(); }
function seller(req,res,next){ if(!['vendedor','admin'].includes(req.session.user.role)) return res.redirect('/'); next(); }

const storage = multer.diskStorage({
  destination: (req,file,cb)=>cb(null, path.join(__dirname,'../public/uploads')),
  filename: (req,file,cb)=>cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'-'))
});
const upload = multer({ storage });

router.get('/dashboard', auth, seller, async (req,res)=>{
  const categories = await getCategories();
  const products = await getMyProducts(req.session.user.id);
  res.render('dashboard', { categories, products });
});

router.post('/create', auth, seller, upload.single('image'), async (req,res)=>{
  const image = req.file ? '/uploads/' + req.file.filename : '/img/product-default.svg';
  await createProduct({ user_id:req.session.user.id, category_id:req.body.category_id, name:req.body.name, description:req.body.description, price:req.body.price, image });
  req.session.message = 'Producto publicado correctamente.';
  res.redirect('/products/dashboard');
});

router.post('/delete/:id', auth, async (req,res)=>{
  await deleteProduct(req.params.id, req.session.user.id, req.session.user.role === 'admin');
  req.session.message = 'Producto desactivado.';
  res.redirect(req.session.user.role === 'admin' ? '/admin' : '/products/dashboard');
});

module.exports = router;
