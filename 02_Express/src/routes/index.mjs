import { Router } from 'express';
import userRouter from "./users.mjs";
import productRouter from './products.mjs';
import { users } from '../utilities/constants.mjs';
import { body, matchedData, validationResult } from 'express-validator';
import passport from 'passport';
import '../strategies/local-strategy.mjs';

const router = Router();

router.get('/', (req, res) => {
    res.send('hello from /api');
});

// use session cookie for authentication  || use arrays for store data
router.post('/auth', [
    body('email').isEmail().withMessage('email is invalid').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('password is required')
], (req, res) => {
    const result = validationResult(req);
    const data = matchedData(req);
    if (result.isEmpty()) {
        const user = users.find(u => u.email === data.email);
        if (!user || user.password !== data.password) {
            res.status(401).json({ result: false, message: "Bad Creditintials", data: '' });
        }

        console.log(req.sessionID);
        req.session.user = user.id;
        res.status(200).json({ result: true, message: "Login Success", data: '' });
    }
    else {
        res.status(400).json({ result: false, message: "Bad Request", data: result.array() });
    }
})

router.get('/auth/status', (req, res) => {
    console.log(req.sessionID);
    // maping sessionID from client to server session Store .  if session is present then get all session data
    req.sessionStore.get(req.sessionID, (err, sessionData) => {
        console.log(sessionData);
        if (err) {
            console.log(err);
            res.status(500).json({ result: false, message: "Internal Server Error", data: '' });
        }
        else if (!sessionData.user && !req.user) {
            res.status(401).json({ result: false, message: "Not authenticated", data: '' });
        }
        else {
            sessionData.user ? res.status(200).json({ result: true, message: "Logged In", data: sessionData.user }) : res.status(200).json({ result: true, message: "login success", data: req.user });
        }
        // else if (sessionData.user) {
        //     res.status(200).json({ result: true, message: "Logged In", data: sessionData.user, });
        // }

    });
});


// use passport authentication && passport session cookie
router.post("/login", [
    body("email").isEmail().withMessage("email is invalid").notEmpty().withMessage("email is required"),
    body("password").notEmpty().withMessage("password is required"),
],
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ result: false, message: "Bad Request", data: result.array() });
        }
        next();
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log(req.sessionID);
        console.log(req.session);
        console.log(req.user);
        res.status(200).json({ result: true, message: "Login Success", data: req.user });

    });


router.get('/logout', (req, res) => {
    console.log(req.sessionID);
    req.sessionStore.get(req.sessionID, (err, sessionData) => {
        if (err) {
            res.status(500).json({ result: false, message: "internal server error", data: '' });
        }
        if (!sessionData.user && !req.user) {
            res.status(401).json({ result: false, message: "Unauthorized", data: '' });
        }

        req.logOut((err) => {
            if (err) return res.status(400).json({ result: false, message: "Bad request", data: '' });
            res.status(200).json({ result: true, message: "Logout successfully", data: '' });
        })
    })
})


// use session cookie for shoping carts
router.post('/cart', [
    body('productId').isInt().withMessage('productId is invalid').notEmpty().withMessage('productId is required'),
    body('name').isString().withMessage('name is invalid').notEmpty().withMessage('name is required'),
    body('price').isFloat().withMessage('price is invalid').notEmpty().withMessage('price is required'),
    body('quantity').isInt().withMessage('quantity is invalid').notEmpty().withMessage('quantity is required'),
], (req, res) => {
    console.log(req.session.id);
    const result = validationResult(req);
    const data = matchedData(req);

    if (result.isEmpty()) {
        req.sessionStore.get(req.session.id, (err, sessionData) => {
            if (err) {
                console.log(err);
                res.status(500).json({ result: false, message: "Internal Server Error", data: '' });
            }
            if (!sessionData.user && !req.user) {
                res.status(401).json({ result: false, message: "Not authenticated", data: '' });
            }
            else {
                const { cart } = sessionData;

                if (cart) {
                    cart.push(data);
                }
                else {
                    sessionData.cart = [data];
                }

                req.sessionStore.set(req.sessionID, sessionData, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    res.status(200).json({ result: true, message: "Cart Added", data: sessionData.cart });
                });
            }
        });
    }
    else {
        res.status(400).json({ result: false, message: "Bad Request", data: result.array() });
    }
});

router.get('/cart', (req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
            res.status(500).json({ result: false, message: "Internal Server Error", data: '' });
        }
        if (!sessionData.user && !req.user) {
            res.status(401).json({ result: false, message: "Not authenticated", data: '' });
        }
        else {
            sessionData.cart ? res.status(200).json({ result: true, message: "Cart", data: sessionData.cart })
                : res.status(200).json({ result: true, message: "Cart", data: [] });
        }
    });
});

// sub routes
router.use(userRouter);
router.use(productRouter);

export default router;