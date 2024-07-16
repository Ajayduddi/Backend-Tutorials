const express = require('express');
const route = express.Router();
const cookieParser = require('cookie-parser')

route.use(cookieParser())

route.get('/', (req, res) => {
    console.log("Render Amazon home page...");
    res.render('index');
});

route.get('/login', (req, res) => {
    console.log("Render login page...");
    res.render('login');
});

route.get('/laptops', (req, res) => {
    console.log("Render laptop page...");
    res.render('laptops');
});

route.get('/mobiles', (req, res) => {
    console.log("Render mobiles page...");
    res.render('mobiles');
});

route.get('/fashion', (req, res) => {
    console.log("Renderfashion page...");
    res.render('fashion');
});

route.get('/topdeals', (req, res) => {
    console.log("Render topdeals page...");
    res.render('topdeals');
});

module.exports = route;