import nguoidanRoute from './routes/nguoidanRoute.js';
import phuongRoute from './routes/phuongRoute.js';
import checkAdmin from './middleware/checkWardUser.js';
import admin from './routes/admin.js';
// Import connectDB function
import connectDB from './config/db.js';

import auth from './routes/auth.js';
import nodemailer from 'nodemailer';
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
import cookieParser from 'cookie-parser';
import User from './models/user.js'; // Đường dẫn tới file user.js
import helpers from './helper/helper.js';
import exphbs from 'express-handlebars';
import password from './routes/password.js'
import checkAdmin2 from './middleware/checkDisUser.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;


app.use(cookieParser());

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
app.engine('hbs', exphbs.engine({ helpers: helpers, extname: '.hbs' })); // Use exphbs instead of hbs


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
  failureRedirect: '/login-fail',
  failureFlash: true,
}), (req, res) => {
  // Middleware sau khi xác thực thành công
  const userRole = req.user.role; // Giả sử có một trường 'role' trong đối tượng user

  // Kiểm tra và chuyển hướng tương ứng
  if (userRole === 1) {
    res.redirect('/home_wardUser');
  } else if (userRole === 2) {
    res.redirect('/admin');
  } else {
    // Trường hợp không xác định
    res.redirect('/login-fail');
  }
});

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
app.use('/register',checkAdmin2,auth);
app.use('/forgot-password',password)
//routes
app.use('/home-guest', nguoidanRoute)
app.use('/home_wardUser', checkAdmin, phuongRoute)
app.use('/admin', checkAdmin2, admin)


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




// // Tạo một transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.MAIL_USER, // Địa chỉ email của bạn
//     pass: process.env.APP_PASSWORD, // Mật khẩu của bạn
//   },
// });

// // Cấu hình nội dung email
// const mailOptions = {
//   from: 'buqcptudw@gmail.com',
//   to: 'phubanh0208@gmail.com', // Địa chỉ email của người nhận
//   subject: 'Test Email',
//   text: 'Hello, this is a test email!',
// };

// // Gửi email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error('Error sending email:', error);
//   } else {
//     console.log('Email sent:', info.response);
//   }
// });