import jwt from 'jsonwebtoken';
import express from 'express';
import cookieParser from 'cookie-parser'
import passport from 'passport';
import './strategies/jwt-strategy.mjs';

const app = express();
app.use(cookieParser());

app.use(passport.initialize());

const secret = 'secret';

app.post('/login', (req, res) => {  
    console.log("post");
    const data = req.body;
    const token = jwt.sign({ data }, secret);
    console.log("token");
    res.cookie('jwt', token, { maxAge: 1*24*60*60*1000, httpOnly: true });
    res.status(200).send('login successful');
});

app.get('/isAuth', (req, res) => { 
    const token = req.cookies?.['jwt'];
    if (token) {
        try {
            jwt.verify(token, secret);
            res.status(200).send('authenticated');
        } catch (error) {
            console.log(error);
            res.status(401).send('invalid user');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

// using passport-jwt
// When using JWT (JSON Web Tokens) for authentication with Passport.js, you typically need to verify the token on each request 
// to ensure that the user is authenticated and authorized to access specific routes.
// This is usually done using passport.authenticate() middleware in each route
app.get('/protected',passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).send('protected');
});

app.listen(3000, () => {
    console.log('server is running on port 3000');
});
