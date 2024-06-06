const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const userController = new UserController('./database.db');
const secretKey = process.env.SECRET_KEY || 'thanhtung0309';
const path = require('path');

router.get('/login', (req, res) => {
    let loginSuccess = false;
    let registerSuccess = false;
    // Kiểm tra xem có thông báo đăng ký thành công không
    console.log(req.query.registerSuccess)
    if (req.query.registerSuccess === 'true') {
        registerSuccess = true;
    }
    res.render(path.join(__dirname, '../views', 'login.ejs'), { loginSuccess, registerSuccess }); // Gửi file ejs cho trình duyệt khi truy cập /login

});

// Xử lý đăng nhập
router.post('/login', (req, res) => {
    let successMessage = '';
    let loginSuccess = false
    userController.loginUser(req.body.username, req.body.password,(error, errorMessage)=>{

        console.log( req.body.username, req.body.password )
        if(error){
            successMessage = "đăng nhập thành công!";
            // Tạo JWT
            const token = jwt.sign({ username: req.body.username }, secretKey);
            // Gửi JWT về cho client
            // res.json({ token:token, username: req.body.username });
            userController.updateUserByName( token, req.body.username, (error, errorMessage)=>{

                req.session.user = { username: req.body.username, loginSuccess: true,token:token, username: req.body.username };
                res.redirect(302, '/home');
            })
        }else{
            successMessage = "đăng nhập thất bại! Vui lòng thử lại";
            res.render('login', { loginSuccess: false, registerSuccess: false, successMessage: true}); // Gửi biến loginSuccess về EJS
        }
    })
});

// Route cho trang đăng ký
router.get('/register', (req, res) => {
    let successMessage = ''
    res.render(path.join(__dirname, '../views', 'register.ejs'), {successMessage}); // Gửi file ejs cho trình duyệt khi truy cập /login
});

// Xử lý đăng ký
router.post('/register', (req, res) => {
    const { username, password, email, reference } = req.body;
    let successMessage = '';
    userController.getUserName(username, (error,errorMessage)=>{
        if(error){
            successMessage = "Đã có tài khoản trên hệ thống. Hãy đặt tài khoản tên khác!";
            res.render('register', { successMessage });
        }else{
            userController.registerUser(req.body.username, req.body.password, req.body.email, req.body.reference)
            successMessage = "Đã đăng ký thành công! Vui lòng đăng nhập tài khoản!.";
            res.redirect('/login?registerSuccess=true');
        }
    })
});


module.exports = router;