const path = require('path');
const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,'public')));

app.use(morgan('combined'));

app.engine('hbs',hbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views','./src/resources/views');
app.get('/', (req,res) => {
  res.render('landing-page');
})  
app.get('/home-department', (req,res) => {
  res.render('home_dp');
})
app.get('/home-guest', (req,res) => {
  res.render('home_g');
})
app.get('/home-district', (req,res) => {
  res.render('home_d');
})
app.get('/report', (req,res) => {
  res.render('report');
})
app.get('/district-list', (req,res) => {
  res.render('district-list');
})
app.get('/ads-manage', (req,res) => {
  res.render('ads-manage');
})
app.get('/ads-approval', (req,res) => {
  res.render('ads-approval');
})
app.get('/report-n-solve', (req,res) => {
  res.render('report-n-solve');
})
app.get('/sign-up', (req,res) => {
  res.render('sign-up');
})
app.get('/assign-management-area', (req,res) => {
  res.render('/assign-management-area');
})
app.listen(port, () => console.log(`Running at http://localhost:${port}`))