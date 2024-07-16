import express from 'express';
import 'dotenv/config';
import routes from "../src/routes/index.mjs";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';

// main app setup
const app = express();
const port = process.env.PORT || 3000;

// mongoose setup
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

// middleware
app.use(express.json()); // accept json data from client
// app.use(cookieParser()); // use cookie parser globally
app.use(cookieParser('secret')); // use cookie parser for signed cookies with secret key [ this secret key is used to sign the cookie to ensure the integrity of the data stored in cookies. ]
app.use(
  // use session manager globally
  session({
    secret: "secret", // The secret key used to sign the session ID cookie. It is a string that should be kept confidential.
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request. [ 'false' means that the session will only be saved if it has been modified ]
    saveUninitialized: false, // This option determines whether to save uninitialized sessions to the session store. An uninitialized session is one that has been created but not modified.
    cookie: {
      maxAge: 60000 * 60, // if the expiry is not set then session will be deleted after browser close
      httpOnly: true, // httpOnly: true means that the cookie is inaccessible to client-side JavaScript code, such as <script> in a web page.
    },
  })
); 
app.use(passport.initialize()); // initialize passport middleware
app.use(passport.session()); // use passport session middleware. which provides session support for Passport authentication.

/* 
 *  By default express session middleware will store session data in memory.
 *  everytime make a new request to the server , server will create a new session.
 *  it's not good because we can't track user session.
 *  then we need to modified the session dataobject for tracking user session.
 *  the express session middleare can validate the cookie came from the client to ensure that it is not expired or invalid.
 *  if it is valid and not expired then server should not create a new session .
 *  
 */

// main route
app.get('/', (req, res) => {
    console.log(req.session.id);
    // req.session.visited = true; // set session dataobject | modify session dataobject
    // req.sessionStore.get(req.session.id, (err,data) => {
    //     if (err) {
    //         console.log(err); 
    //         throw err;
    //     }
    //     else {
    //         console.log(data);
    //     }
    // });
    res.cookie('token', '123456789', { maxAge: 60000 * 60  , httpOnly: true }); // set cookie 1000 ms == 1 second
    res.cookie('username', 'ajay', { maxAge: 60000 * 60  , httpOnly: true, signed: true }); // this is signed cookie
    res.send('Hello World!')
});

// sub routes
app.use('/api', routes);


// listen http request
app.listen(port, () => {
    console.log(`Server is runnig at http://localhost:${port}`);
})