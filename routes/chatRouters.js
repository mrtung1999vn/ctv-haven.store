const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const WorkersController = require('../controllers/workersController');
const userController = new UserController('./database.db');
const workersController = new WorkersController('./database.db');

const jwt = require('jsonwebtoken');
const secretKey = 'thanhtung0309' ||  process.env.SECRET_KEY;
const path = require('path');
const CryptoJS = require('crypto-js');
// Import thư viện Axios
const axios = require('axios');


// Route cho trang chat
router.get('/chat', (req, res) => {
    // Lấy thông tin người dùng từ session
    const username = req.session.username;
    const token = req.session.token;
    console.log( username, token )
    let successMessage = ''
    res.render(path.join(__dirname, '../views', 'chat.ejs'), {successMessage:successMessage, username: req.username}); // Gửi file ejs cho trình duyệt khi truy cập /login
});


module.exports = router;