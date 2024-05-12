const express = require('express');
const UserController = require('./controllers/userController');
const path = require('path');
const { error } = require('console');
const cors = require('cors');
const secretKey = process.env.SECRET_KEY || 'thanhtung0309';
const app = express();
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 1001;

// Enable CORS for all routes
app.use(cors());


// Cấu hình EJS làm trình động mặc định cho Express
app.set('view engine', 'ejs');

const userController = new UserController('./database.db');

// Middleware để xử lý dữ liệu gửi từ form
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/views/css'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, '/views/img'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, '/views/js'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, 'views'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)

app.get('/login', (req, res) => {
    let loginSuccess = false
    res.setHeader('Content-Type', 'text/html'); // Đặt header Content-Type là text/html
    res.render(path.join(__dirname, 'views', 'login.ejs'), {loginSuccess}); // Gửi file ejs cho trình duyệt khi truy cập /login
});

// Xử lý đăng nhập
app.post('/login', (req, res) => {
    let successMessage = '';
    let loginSuccess = false
    userController.loginUser(req.body.username, req.body.password,(error, errorMessage)=>{
        if(error){
            successMessage = "đăng nhập thành công!";
            console.log(successMessage)
            // Tạo JWT
            const token = jwt.sign({ username: req.body.username }, secretKey);
            // Gửi JWT về cho client
            res.json({ token:token, username: req.body.username });

            res.render('login', { loginSuccess: true }); // Gửi biến loginSuccess về EJS

        }else{
            
            successMessage = "đăng nhập thất bại! Vui lòng thử lại";
            console.log(successMessage)

            res.render('login', { loginSuccess: false }); // Gửi biến loginSuccess về EJS
        }
    })
});

// Route cho trang đăng ký
app.get('/register', (req, res) => {
    let successMessage = ''
    res.setHeader('Content-Type', 'text/html'); // Đặt header Content-Type là text/html
    res.render(path.join(__dirname, 'views', 'register.ejs'), {successMessage}); // Gửi file ejs cho trình duyệt khi truy cập /login
});

// Xử lý đăng ký
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    let successMessage = '';
    userController.getUserName(username, (error,errorMessage)=>{
        if(error){
            successMessage = "Đã có tài khoản trên hệ thống. Hãy đặt tài khoản tên khác!";
            res.render('register', { successMessage });
        }else{
            userController.registerUser(req.body.username, req.body.password)
            successMessage = "Đã đăng ký thành công! Vui lòng đăng nhập tài khoản!.";
            res.render('register', { successMessage });
        }
    })

});


//#region Giới Thiệu App
app.get('/', (req, res) => {
    console.log("")
    res.setHeader('Content-Type', 'text/html'); // Đặt header Content-Type là text/html
    res.render(path.join(__dirname, 'views', 'hello-app.ejs')); // Gửi file ejs cho trình duyệt khi truy cập /login
})
//#endregion

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});