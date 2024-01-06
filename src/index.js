import nguoidanRoute from './routes/nguoidanRoute.js';
import phuongRoute from './routes/phuongRoute.js';

import path from 'path';
import express from 'express';
import morgan from 'morgan';
import hbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import passportLocalMongoose from 'passport-local-mongoose';
import User from './models/user.js'; // Đường dẫn tới file user.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

//login setup
app.use(session({
  secret: 'kichBanMat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Sử dụng body-parser middleware để phân tích dữ liệu POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//dotenv
dotenv.config();
// Import connectDB function
import connectDB from './config/db.js';

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
app.get('/', (req,res) => {
  res.render('landing-page');
})  

//login routes
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));
//routes
app.use('/home-guest', nguoidanRoute)
app.use('/home_wardUser',phuongRoute)


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