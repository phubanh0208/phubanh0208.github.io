// routes/auth.js
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';
import sendEmail from '../helper/sendEmail.js';

const router = express.Router();
const generateHtmlEmail = (otp) => {
    return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f2f2f2;
            color: #333;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          h1 {
            color: #009688;
          }

          p {
            line-height: 1.6;
          }

          strong {
            color: #e91e63;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Chào bạn,</h1>
          <p>
            Bạn đã yêu cầu đặt lại mật khẩu và đây là mã OTP của bạn: <strong>${otp}</strong>.
          </p>
          <p>
            Vui lòng không chia sẻ mã này với người khác.
          </p>
          <p>
            Trân trọng,<br>
            Nhóm Hỗ trợ
          </p>
        </div>
      </body>
    </html>
  `;
  };
  function generateRandomNumber() {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }
var randomNumber = generateRandomNumber();
router.get('/', (req, res) => {
    
  });

router.post('/otpsend', async (req, res) => {
  try {
    const emailCheck = req.body.email;
    const user = await User.findOne({email:emailCheck});
    randomNumber = generateRandomNumber();
    if (user){
        sendEmail(emailCheck,'CHÀO BẠN, BẠN ĐÃ YÊU CẦU CẤP OTP MẬT KHẨU',generateHtmlEmail(randomNumber))
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.redirect('/register');
  }
});

// Thêm các routes khác nếu cần

router.post('/reset', async (req, res) => {
    try {
      const emailCheck = req.body.email;
      const otpcheck =req.body.otp;
      console.log(emailCheck);
      if (otpcheck == randomNumber){
      res.render('forgotpass',{emailCheck});
      }
      else{
        console.log(otpcheck,randomNumber);
        res.send('Sai OTP')
        res.redirect('/');

      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.redirect('/');
    }
  });
  router.post('/update', async (req, res) => {
    try {
      const emailCheck = req.body.email;
      const username =req.body.username;
      const password = req.body.password;
      const user = await User.findOneAndUpdate(
        { email: emailCheck },
        { username: username, password: password }// Trả về người dùng đã được cập nhật
      );
      console.log(user)
     res.redirect('/');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.redirect('/');
    }
  });
export default router;
