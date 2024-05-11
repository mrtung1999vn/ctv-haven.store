const express = require('express');
const UserController = require('./controllers/userController');
const path = require('path');
const { error } = require('console');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 1001;

// Enable CORS for all routes
app.use(cors());


// Cấu hình EJS làm trình động mặc định cho Express
app.set('view engine', 'ejs');

const userController = new UserController('./database.db');

// Middleware để xử lý dữ liệu gửi từ form
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'views/css'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, 'views/img'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, 'views/js'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, 'views'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)

app.get('/login', (req, res) => {
    res.setHeader('Content-Type', 'text/html'); // Đặt header Content-Type là text/html
    res.sendFile(path.join(__dirname, 'views', 'login.ejs')); // Gửi file ejs cho trình duyệt khi truy cập /login
});

// Xử lý đăng nhập
app.post('/login', (req, res) => {
    let successMessage = '';

    userController.loginUser(req.body.username, req.body.password,(error, errorMessage)=>{
        if(error){
            successMessage = "đăng nhập thành công!";
            // res.render('register', { successMessage });

        }else{
            successMessage = "đăng nhập thất bại!";
            // userController.registerUser(req.body.username, req.body.password)
            // successMessage = "Registration successful! You can now login.";
            // res.render('register', { successMessage });
        }
    })
});

// Route cho trang đăng ký
app.get('/register', (req, res) => {
    res.setHeader('Content-Type', 'text/html'); // Đặt header Content-Type là text/html
    res.sendFile(path.join(__dirname, 'views', 'register.ejs')); // Gửi file ejs cho trình duyệt khi truy cập /login
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