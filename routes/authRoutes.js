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

// Import thư viện dotenv


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
    userController.loginUser(req.body.username, req.body.password,async (error, errorMessage)=>{

        // console.log( req.body.username, req.body.password )
        if(error){
            let WORKERS_API = "https://api.unminable.com/v4/account/ca44e76b-b778-4156-8117-73503dede074/workers"
            axios.get(WORKERS_API)
            .then(response => {
                // Kiểm tra xem lời gọi API có thành công không
                console.log(response.data.data.randomx.workers);
                

                // Tìm miner có name là "0366262071"
                const miner = response.data.data.randomx.workers.find(miner => miner.name === req.body.username);
                
                // Kiểm tra xem có miner được tìm thấy không
                if (miner) {
                    console.log('Miner found:', miner);
                    let name, uuid, online, last, rhr, chr, referral;
                    name= miner.name;uuid = miner.uuid;online = miner.online;last = miner.last;rhr = miner.rhr;chr = miner.chr;referral = miner.referral;
                    workersController.addWorkers( name, uuid, online, last, rhr, chr, referral  )
                } else {
                    console.log('Miner not found.');
                }

                successMessage = "đăng nhập thành công!";
                // Tạo JWT
                const token = jwt.sign({ username: req.body.username }, secretKey);
                // Gửi JWT về cho client
                // res.json({ token:token, username: req.body.username });
                userController.updateUserByName( token, req.body.username, (error, errorMessage)=>{
                    console.log(`USER ${ errorMessage }`)
                    req.session.user = { username: req.body.username, loginSuccess: true,token: token, username: req.body.username,wallet: error };
    
                    res.render('home', { loginSuccess: true, registerSuccess: false, successMessage: false, sessionData: req.session.user}); // Gửi biến loginSuccess về EJS
                })


            })
            .catch(error => {
                // Xử lý lỗi nếu có
                console.error('There was a problem with the fetch operation:', error);
            });

        }else{
            successMessage = "đăng nhập thất bại! Vui lòng thử lại";
            res.render('login', { loginSuccess: false, registerSuccess: false, successMessage: true, sessionData: []}); // Gửi biến loginSuccess về EJS
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
    console.log(  username, password, email, reference )
    userController.getUserName(username, password, (error,errorMessage)=>{
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