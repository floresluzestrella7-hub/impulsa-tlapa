const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { createUser, findUserByEmail } = require('../models/userModel');

router.get('/login', (req,res)=>res.render('login'));
router.get('/register', (req,res)=>res.render('register'));

router.post('/register', async (req,res)=>{
  try{
    const { name, email, password, phone, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await createUser({ name, email, password: hash, phone, role });
    req.session.message = 'Registro exitoso. Ahora inicia sesión.';
    res.redirect('/auth/login');
  }catch(e){ req.session.message = 'No se pudo registrar. Revisa si el correo ya existe.'; res.redirect('/auth/register'); }
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if(!user || !user.active || !(await bcrypt.compare(password, user.password))){
    req.session.message = 'Correo o contraseña incorrectos.';
    return res.redirect('/auth/login');
  }
  req.session.user = { id:user.id, name:user.name, email:user.email, phone:user.phone, role:user.role };
  res.redirect('/');
});

router.get('/logout', (req,res)=>req.session.destroy(()=>res.redirect('/')));
module.exports = router;
