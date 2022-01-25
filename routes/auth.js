require('dotenv').config({ path: `.env.local` });
const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { isNotAuthenticated, isAuthenticated } = require('../middlewares/authorize')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// auth routes
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login', {msg: null});
});

router.get('/signup', isNotAuthenticated, (req, res) => {
    res.render('signup', {msg: null});
});

router.get('/resetpass', isNotAuthenticated, (req, res) => {
    res.render('resetpass', {msg: null});
});

router.get('/resetpass/:token', async (req, res) => {
    const token = req.params.token;

    try{
        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
        if(!user){
            res.status(401).render('resetpass', {msg: "Invalid password reset token!"});
        }else{
            res.render('resetpassform', {email: user.email});
        }
    }catch(err){
        res.status(500).redirect('/500');
    }
});

router.post('/resetpass/:token', async (req, res) => {
    const { password } = req.body;
    const token = req.params.token;

    try{
        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
        if(!user){
            res.status(401).render('resetpass', {msg: "Invalid password reset token!"});
        }else{
            const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
            const passwordHash = await bcrypt.hash(password, salt);
            await User.updateOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}}, {password : passwordHash});

            res.redirect('/auth/login');
        }
    }catch(err){
        res.status(500).redirect('/500');
    }
});

router.post("/signup", isNotAuthenticated, async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    try{
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await User.create({
            name: name,
            email: email,
            password: passwordHash
        });

        res.redirect('/auth/login');
    }catch(err){
        res.status(500).redirect('/500');
    }
});

router.get('/logout', isAuthenticated, (req, res) => {
    res.cookie("token", "", { httpOnly: true });
    res.redirect('/auth/login');
})

router.post("/login", isNotAuthenticated, async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email: email });
        if(!user){
            res.status(401).render('login', {msg: "Email or password incorrect!"});
        }else{
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid){
                const token = jwt.sign({
                    name: user.name,
                    email: user.email
                }, process.env.JWT_SECRET, {
                    expiresIn: "12h"
                });

                res.cookie('token', token, { httpOnly: true });
                res.redirect('/');
            }else{
                res.status(401).render('login', {msg: "Email or password incorrect!"});
            }
        }
    }catch(err){
        console.log(err);
        res.status(500).redirect('/500');
    }
});

router.post('/resetpass', isNotAuthenticated, async (req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({ email: email });
        if(!user){
            res.render('resetpass', {msg: "Email not found!"});
        }else{
            const passResetToken = crypto.randomBytes(20).toString('hex')
            await User.updateOne({email: email}, { $set: {"resetPasswordToken" : passResetToken, "resetPasswordExpires" : Date.now() + 3600000}});
            
            let link = "http://" + req.headers.host + "/auth/resetpass/" + passResetToken;
            console.log(link, user.email);
            const mailOptions = {
                to: user.email,
                from: process.env.FROM_EMAIL,
                subject: "Password change request",
                text: `Hi ${user.name} \n 
            Please click on the following link ${link} to reset your password. \n\n 
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            await sgMail.send(mailOptions);

            res.render('resetpass', {msg: "Reset password email sent to registered account!"});
        }
    }catch(err){
        console.log(err);
        res.status(500).redirect('/500');
    }
});

module.exports = router;