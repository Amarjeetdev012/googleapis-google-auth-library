import express from 'express';
import { main } from './google.authenticate.js';

const router = express.Router();
router.get('/',(req,res)=>{
    res.render('home')
})
router.get('/auth', main);


export default router;
