import { Router } from 'express';
import { products } from '../utilities/constants.mjs'

const router = Router();

router.get('/products', (req, res) => { 
    if (req.cookies.token) { // here token cookie is used for authentication method 1
        if (req.signedCookies.username === 'ajay') { // here username signed cookie is used for authentication method 2
            res.json({ result: true, message: 'products', data: products });

        }
    }
    res.status(401).json({ result: false, message: 'Unauthorized', data: null });
});

export default router;