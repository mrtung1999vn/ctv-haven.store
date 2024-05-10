const express = require('express');
const UserController = require('./controllers/userController');
const path = require('path');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 1001;

// Cấu hình EJS làm trình động mặc định cho Express
app.set('view engine', 'ejs');

const userController = new UserController('./database.db');

// Middleware để xử lý dữ liệu gửi từ form
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.ejs')); // Gửi file ejs cho trình duyệt khi truy cập /login
});

// Xử lý đăng nhập
app.post('/login', (req, res) => {
    userController.loginUser(req.body.username, req.body.password)
});

// Route cho trang đăng ký
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.ejs')); // Gửi file ejs cho trình duyệt khi truy cập /login
});

// Xử lý đăng ký
app.post('/register', (req, res) => {


    const { username, password } = req.body;
    let successMessage = ''
    userController.getUserName(username, (error,errorMessage)=>{
        console.log(error)
        if(error){
            console.log('dang ky that bai')
            successMessage = "Username already exists. Please choose a different username.";
            res.render('register', { successMessage });
        }else{
            console.log('dang ky thanh cong')
            userController.registerUser(req.body.username, req.body.password)
            successMessage = "Registration successful! You can now login.";
            res.render('register', { successMessage });
        }
    })

});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});