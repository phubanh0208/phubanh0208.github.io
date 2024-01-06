import nguoidanRoute from './routes/nguoidanRoute.js';
import phuongRoute from './routes/phuongRoute.js';
import checkAdmin from './middleware/checkWardUser.js';
// Import connectDB function
import connectDB from './config/db.js';

import auth from './routes/auth.js'

import path from 'path';
import express from 'express';
import morgan from 'morgan';
import hbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
import flash from 'connect-flash';
import cors from 'cors'
import User from './models/user.js'; // Đường dẫn tới file user.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

app.use(cors());
//login setup
app.use(session({
  secret: 'kichBanMat',
  resave: false,
  saveUninitialized: false,
  
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Định nghĩa phương thức xác thực local
passport.use(new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done) => {
    try {
      // Tìm người dùng trong MongoDB với tên đăng nhập và mật khẩu
      const user = await User.findOne({ username, password });
      if (user) {
        // Người dùng tồn tại, trả về thông tin người dùng
        return done(null, user);
      } else {
        // Người dùng không tồn tại hoặc mật khẩu không chính xác
        return done(null, false, { message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
      }
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }
));

// Lưu thông tin người dùng vào session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Lấy thông tin người dùng từ session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


// Sử dụng body-parser middleware để phân tích dữ liệu POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//dotenv
dotenv.config();


//import routes
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'models')));
app.use(express.static(path.join(__dirname,'controllers')));

app.use(morgan('combined'));

app.engine('hbs',hbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views','./src/resources/views');

//databse config
connectDB();

//homepage
app.get('/', (req,res) => {
  res.render('landing-page');
})  

//login routes

app.post('/login', passport.authenticate('local', {
  successRedirect: '/home_wardUser',
  failureRedirect: '/login-fail',
  failureFlash: true,  // Bật chức năng cảnh báo
}));

// Route cho trang đăng nhập thất bại
app.get('/login-fail', (req, res) => {
  res.render('landing-page2');
});
//logout
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

//register
app.use('/register',auth);
//routes
app.use('/home-guest', nguoidanRoute)
app.use('/home_wardUser', checkAdmin, phuongRoute)


app.listen(port, () => console.log(`Running at http://localhost:${port}`))
// c
// app.get('/home-guest', (req,res) => {
//   res.render('home_g');
// })
//   res.render('home_d');
// })
// app.get('/report', (req,res) => {
//   res.render('report');
// })
// app.get('/district-list', (req,res) => {
//   res.render('district-list');
// })
// app.get('/ads-manage', (req,res) => {
//   res.render('ads-manage');
// })
// app.get('/ads-approval', (req,res) => {
//   res.render('ads-approval');
// })
// app.get('/report-n-solve', (req,res) => {
//   res.render('report-n-solve');
// })
// app.get('/sign-up', (req,res) => {
//   res.render('sign-up');
// })
// app.get('/assign-management-area', (req,res) => {
//   res.render('assign-management-area');
// })
// app.listen(port, () => console.log(`Running at http://localhost:${port}`))