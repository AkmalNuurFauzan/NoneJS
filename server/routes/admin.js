const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { create } = require('connect-mongo');

const adminLayout = '../views/layouts/admin';
const jwtsecret = process.env.JWT_SECRET;

/**
 * POST/
 * Check Login
 */
const authMiddleware = (req,res, next) =>{
    const token =req.cookies.token;

    if(!token){
        return res.status(401).json( { message: 'Unauthorized' } );
    }
    try {
        const decoded = jwt.verify(token, jwtsecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json( { message: 'Unauthorized' } );        
    }
}


/**
 * GET/
 * admin - Login page
 */
router.get('/admin', async (req, res) => {
    const locals = {
        title: "Admin",
        description: "Simple Blog using NodeJs, express & mongoDb"
    }

    try {
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
    
});

/**
 * POST/
 * admin - Check Login 
 */
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne( { username } );

        if(!User){
            return res.status(401).json( { message: 'Invalid Credentials '} );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json( { message: 'Invalid Credentials'} );
        }

        const token = jwt.sign({ userId: user._id }, jwtsecret );
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');

    } catch(error) {    
        console.log(error);
    }    
});

/**
 * GET/
 * Admin Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: "Simple Blog using NodeJs, express & mongoDb"
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        })
    } catch(error){
        console.log(error);
    }
});

/**
 * GET/
 * Admin - Create New Post 
 */
router.get('/add-post', authMiddleware, async (req, res) => {
    
    try {
        const locals = {
            title: 'Add Post',
            description: "Simple Blog using NodeJs, express & mongoDb"
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });
    } catch(error){
        console.log(error);
    }
});


/**
 * GET/
 * Admin - Register 
 */
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         try {
//             const user = await User.create({ username, password: hashedPassword });
//             res.status(201).json({ message: 'User Created', user });
//         } catch (error) {
//             if(error.code === 11000){
//                 res.status(409).json({ message: 'User already in use' });
//             }
//             res.status(500).json({ message: 'Internal server error' })
//         }
//     } catch (error) {
//         console.log(error);
//     }
    
// });

module.exports = router;