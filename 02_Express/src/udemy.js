import express from "express";
import fs from 'fs';
import 'dotenv/config'
import cookieParser from "cookie-parser"; // to parse cookies from HTTP requests and makes them available  in the req.cookies object.

const app = express();
const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set("view engine", "ejs");


// Sub Routes
const admin = express.Router();
const user = express.Router();

app.use("/admin", admin);
app.use("/user", user);


/* 
 * middleware functions 
*/
const middleware1 = (req, res, next) => {
    console.log("this is a middleware 1");
    next();
};
const middleware2 = (req, res, next) => {
    // throw an error to next middleware : method 1
    // throw new Error('throw an error in the middleware 2');
    // next();

    // method 2
    next("throw an error in the middleware 2"); // throw an error to next function simple method
};
// errorhandling middleware
const errorMiddleware = (err, req, res, next) => {
    // console.log(err);
    console.log("error mssage : ", err.mesage);
    console.log("error stack : ", err.stack);
    res.status(500).send(err.stack);
};


/* 
 * use middlewares 
*/
app.use(cookieParser());
app.use(middleware1); // use middleware globally method 1
// app.use('/',middleware2); // use middleware for particular path method 1



// main routing
app.get("/", middleware2 ,(req, res) => { // use middleware for particular path method 2
    const cookies = req.cookies; // read cookies from client
    console.log(cookies);
    res.render("index", { name: "Ajay Duddi", email: "9H6YU@example.com" });
});
app.get("/format", (req,res,next) => { // declare and use middleware for particular path method 3
    
    console.log('inline middleware');
    next();
    
}, (req, res) => {
    
    // send response in different formats
    res.format({
        "text/plain": () => {
            res.send("Hello World! from text/plain");
        },
        "application/json": () => {
            res.json({ name: "Ajay Duddi", email: "9H6YU@example.com" });
        },
        "text/html": () => {
            res.render("index", { name: "Ajay Duddi", email: "9H6YU@example.com" });
        },
        default: () => {
            res.status(406).send("Not Acceptable");
        },
    });
});
app.get('/error',(req,res,next) => {
    // throw an error
    fs.readFile('test.txt',(err,data) => {
        if(!err){
            res.send(data.toString());
        }else{
            next(err);
        }
    })
})


// admin sub route routing
admin.get("/", (req, res) => {
    const { email } = req.cookies; // read cookies with particular name from client    
    console.log(email);
    res.send("Hello World! from admin"); // send response to client
});
admin.get("/json", (req, res) => {
    // sending json response
    res.json({
        name: "Ajay Duddi",
        age: 21,
    });
});

// admin sub route routing
admin.get("/redirect", (req, res) => {
    // set this location in the response header
    res.location("/admin");
    // set response header
    res.set("name", "value");
    // read the response header
    console.log(res.get("name"));
    // redirecting to another route
    res.redirect("/");
});


// user sub route routing
user.get("/", (req, res) => {
    res.cookie("email", "9H6YU@example.com", { maxAge: 900000, httpOnly: true }); // send cookie to the client with name: email and value: 9H6YU@example.com. httponly means prevent read and write access to the client side scripting
    res.send("Hello World! from user");
});
user.get("/clear", (req, res) => {
    res.clearCookie("email"); // clear cookie with name: email
    res.send("cookie cleared");
});

// use error handling middleware
app.use(errorMiddleware);

app.listen(port, () => console.log(`Example app listening on port ${port}`));
