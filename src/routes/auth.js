// routes/auth.js
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('register');
  });

router.post('/', async (req, res) => {
  try {
    const { username, password, email, phone,role=1} = req.body;
    const user = await User.create({ username, password, email, phone,role});
    res.redirect('/');
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.redirect('/register');
  }
});

// Thêm các routes khác nếu cần

export default router;
