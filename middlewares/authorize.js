require('dotenv').config({ path: `.env.local` });
const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        res.status(401).redirect('/auth/login');
    }else{
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.body.email = decoded.email;
            next();
        }catch(err){
            res.status(401).redirect('/auth/login');
        }
    }
}

exports.isNotAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        next();
    }else{
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.redirect('/');
        }catch(err){
            next();
        }
    }
}