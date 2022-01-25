require('dotenv').config({ path: `.env.local` });
const express = require('express');
const app = express();
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authorize');

router.get('/', isAuthenticated, (req, res) => {
    res.render('index');
});

router.get('/404', (req, res) => {
    res.render('404');
})

router.get('/500', (req, res) => {
    res.render('500');
})

module.exports = router;