// DATA DEMO 0923107421

const express = require('express');
const UserController = require('./controllers/userController');
const path = require('path');
const { error } = require('console');
const cors = require('cors');
const secretKey = process.env.SECRET_KEY || 'thanhtung0309';
const app = express();

const PORT = process.env.PORT || 1001;
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');


// Sử dụng session middleware
app.use(session({
    secret: secretKey, // Secret key để ký và bảo vệ session ID
    resave: false, // Không lưu lại session nếu không có sự thay đổi
    saveUninitialized: false // Không tạo session cho người dùng nếu chưa được khởi tạo
}));

// Enable CORS for all routes
app.use(cors());

// Cấu hình EJS làm trình động mặc định cho Express
app.set('view engine', 'ejs');
// Middleware để phân tích nội dung gửi dưới dạng JSON
app.use(express.json());
const userController = new UserController('./database.db');

// Middleware để xử lý dữ liệu gửi từ form
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/views/css'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, '/views/img'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, '/views/js'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, 'views'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)


// Sử dụng các tệp tin tuyến cho các phần cụ thể của ứng dụng
app.use('/', authRoutes);






//#region Giới Thiệu App
app.get('/', (req, res) => {
    console.log("")
    res.render(path.join(__dirname, 'views', 'hello-app.ejs')); // Gửi file ejs cho trình duyệt khi truy cập /login
})
//#endregion

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



//#region Home
app.get(`/home`, (req, res) => {
    console.log("home")
    res.render(path.join(__dirname, 'views', 'home.ejs')); // Gửi file ejs cho trình duyệt khi truy cập /login
})
//#endregion