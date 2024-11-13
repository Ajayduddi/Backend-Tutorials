import express from 'express';
import { DB1, DB2, DB3 } from './database.js';
// import bodyParser from 'body-parser'; 

// create a express server
const app = express();

// parse the json body into the Javascript object
// app.use(bodyParser.json());  // from express 4.16 we not need body-parser. because express has built-in body parser
app.use(express.json());

// middleware for all routes
app.use((req, res,next) => {
    DB1.run(`insert into log(log_message) values(?)`, ["method:"+req.method+", url:"+req.originalUrl + ", http:" + req.httpVersion+", hostname:"+req.hostname+", userAgent:"+req.headers['user-agent']], (err) => {
        if (err) {
            console.log(err.message);
        }
    });
    next();
})

// routes
app.get('/', (req, res) => [
    res.send("Welcome to node sql server")
]);

// get all users from the database
app.get('/users', (req, res) => {
    DB3.all('select * from users', (err, data) => {
        if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
            return;
        }
        res.status(200).json({ message: "success", data: data });
    });
});

// get user by id
app.get('/user', (req, res) => {
    const id = req.query['id'];
    DB3.get(`select * from users where user_id = ${id}`, (err, data) => {
        if (err) {
            console.log(err.message);
            res.status(404).json({ message: " user not found" });
            return;
        }

        res.status(200).json({ message: "success", data: data });
    });
});

// add user to database
app.post('/user', (req, res) => {
    const data = req.body;
    let sql = `insert into users(user_name,user_salary) values(?,?)`;
    DB3.run(sql, [data.name, data.salary], (err) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ message: err.message });
            return;
        }

        res.status(201).json({ message: " success", data: `user create successfully` });
    });
});

// update user by id to database
app.put('/user', (req, res) => {
    const data = req.body;
    const id = req.query['id'];
    let sql = `update users set user_name = ?, user_salary = ? where user_id = ?`;
    DB3.run(sql, [data.name, data.salary,id], (err) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ message: err.message });
            return;
        }

        res.status(201).json({ message: " success", data: `user updated successfully` });
    });
});

// delete user by id to database
app.delete('/user', (req, res) => {
    const id = req.query['id'];
    let sql = `delete from users where user_id = ?`;
    DB3.run(sql, [id], (err) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ message: err.message });
            return;
        }

        res.status(201).json({ message: " success", data: `user deleted successfully` });
    });
});





// get in memeory log details
app.get('/log', (req, res) => {
    DB1.all('select * from log', (err, data) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ message: err.message });
            return;
        }
        
        res.status(200).json({ message: "success", data: data });
    });
});

app.listen(3000, () => {
    console.log(`server started at port http://127.0.0.1:3000/`);
})
