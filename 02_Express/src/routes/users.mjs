import { Router } from "express";
import { body, validationResult, matchedData, checkSchema } from "express-validator";
import { userSchema } from "../utilities/validationSchema.js";
import { users } from '../utilities/constants.mjs';  // import users data from arrays
import { user } from '../mongoose/schemas/user.mjs';  // import user schema from mongoose
import { resolveIndexById } from '../utilities/middlewares.mjs'
import { hashPassword } from '../utilities/helpers.mjs';

const router = Router();


// get all users | get user by filter using query params
router.get('/users', (req, res) => {
    // filtering data with query params
    const { sort, value } = req.query;
    const sortedUsers = users.sort((a,b) =>{ 
        if (sort === 'name') return a.name.localeCompare(b.name)
        else if (sort === 'email') return a.email.localeCompare(b.email)
        else a.id - b.id
    });
    // .includes() method is used to filter data based on value. by checking substring of the value
    if (sort && value) return res.json({ result: true, message: "", data: sortedUsers.filter(u => u.name.includes(value)) });
    else if (value) return res.json({ result: true, message: "", data: users.filter(u => u.name.includes(value)) });
    else if (sort) return res.json({ result: true, message: "", data: sortedUsers });

    res.json({ result: true, message: "", data: users });
});

// get user by id [ route params  | path varible]   ||  use resolveIndexById middleware
router.get('/users/:id', resolveIndexById, (req, res) => {
    const { index } = req;
    if (index !== -1) {
        res.json({ result: true, message: '', data: users[index] });

    }
    else {
        res.status(404).json({ result: false, message: "User Not Found", data: null });
    }
});

// add user
router.post('/users',[
    // use express-validator
    body('name').isString().withMessage('name must be a string').notEmpty().withMessage('name is required'),
    body('email').isString().withMessage('email must be a string').notEmpty().withMessage('email is required').isEmail().withMessage('email is not valid'),
    body('password').notEmpty().withMessage('password is required')
],async (req, res) => {
    const result = validationResult(req);
    const data = matchedData(req);
    if (result.isEmpty()) {

        // create new user and store into array of users
        // const newUser = { id: users[users.length - 1].id + 1, ...data };
        // if (users.push(newUser)) {
        //     res.status(201).json({ result: true, message: "User added Successfuly", data: newUser });
        // }
        // else{
        //     res.status(500).json({result:false, message: "Internal Server error", data: null});
        // }

        // create new user and store into mongoose database
        data.password = await hashPassword(data.password); // hash the password using bcrypt
        console.log(data);
        const newUser = new user({ ...data });
        try {
            const savedUser = await newUser.save();
            res.status(201).json({ result: true, message: "User added Successfuly", data: savedUser });
        } catch (error) {
            console.log(error);
            res.status(500).json({ result: false, message: "Internal Server error", data: null });
        }
    }
    else {
        res.status(400).json({ result: false, message: 'Bad Request', data: result.array() });
    }
})

// update entier record  ||  use resolveIndexById middleware ||  use checkSchema middleware form express-validator to validate the data
router.put('/users/:id', checkSchema(userSchema), resolveIndexById, (req,res) => {
    const result = validationResult(req);
    const data = matchedData(req);
    const {index} = req;
    if (result.isEmpty()) {
        if (index !== -1) {
            users[index] = {id:users[index].id, ...data}
            res.status(202).json({result:true, message: 'User Updated Successfully', data:users[index]});
        }
        else{
            res.status(404).json({result:false, message: "User Not Found", data:null});
        }
    }
    res.status(400).json({result:false, message:"Bad Request", data: result.array() });
})

// update the particularelement in the record | patch the record  ||  use resolveIndexById middleware
router.patch('/users/:id', resolveIndexById, (req,res) => {
    const {body, index } = req;
    if (Object.keys(body).length !== 0) {
        if (index !== -1) {
            users[index] = {...users[index], ...body}; // override the existing data with the new body data
            res.status(202).json({result:true, message: 'User patch Successfully', data:''});
        }
        else{
            res.status(404).json({result:false, message: "User Not Found", data:null});
        }
    }
    res.status(400).json({result:false, message:"Bad Request", data: null});
})

// delete user    ||  use resolveIndexById middleware
router.delete('/users/:id', resolveIndexById, (req, res) => {
    const { index } = req;
    if (index !== -1) {
        users.splice(index, 1);
        res.status(202).json({ result: true, message: 'User Deleted Successfully', data: users[index] });
    }
    else {
        res.status(404).json({ result: false, message: "User Not Found", data: null });
    }
})

export default router;