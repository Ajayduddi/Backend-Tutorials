const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Optionally, you can define a static files directory (CSS, JS, images, etc.)
app.use(express.static(__dirname + '/public'));

// a middleware function with no mount path. This code is executed for every request to the router
app.use((req, res, next) => {
    console.log('Time:', Date.now('DD-MM-YYYY HH:MM:SS'));
    next()
});

app.get('/',(req, res) => {
    console.log("Render password validation page...");
    // res.send("hi");
    res.render('password validation');

});

app.post('/',(req, res, next) => { // this middleware is executed with in the mounted path '/'
    console.log(req.method);
    next();
},(req, res) => {
    res.render('index');
});

// app.use('/:id',userId,(req, res) => {
//     res.send('Id is ' + req.params.id);
// });

app.use('/user/:id', (req, res, next) => {
    console.log('Request URL:', req.originalUrl)
    next()
  }, (req, res) => {
    res.sendStatus(200).send("request method is " + req.method);
})

const amazon = require('./routes/amazon');
app.use('/amazon',amazon);

function userId(req, res, next) {
    console.log('this is a middleware');
    console.log(req.params.id);
    next();
};

app.listen(3000,()=>{
    console.log("server started at http://localhost:3000");
});