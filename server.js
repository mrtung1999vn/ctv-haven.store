// DATA DEMO 0923107421

const express = require('express');
const UserController = require('./controllers/userController');
const path = require('path');
const { error } = require('console');
const cors = require('cors');
const secretKey = 'thanhtung0309' || process.env.SECRET_KEY;
const app = express();
const http = require('http');
const PORT = process.env.PORT || 1001;
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRouters');
const socketIo = require('socket.io');
const server = http.createServer(app);
// Sử dụng server để tạo Socket.io instance
const io = socketIo(server);
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


// Middleware để xử lý dữ liệu gửi từ form
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/views/css'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, '/views/img'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, '/views/js'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)
app.use(express.static(path.join(__dirname, 'views'))); // Đặt thư mục chứa các tệp tĩnh (ví dụ: CSS, hình ảnh)


// Sử dụng các tệp tin tuyến cho các phần cụ thể của ứng dụng
app.use('/', authRoutes);
// Sử dụng các tệp tin tuyến cho các phần cụ thể của ứng dụng
app.use('/', chatRoutes);


// Lắng nghe sự kiện kết nối từ client
io.on('connection', (socket) => {
    console.log('A user connected');

    // Lắng nghe sự kiện chat message từ client
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        // Phát lại tin nhắn cho tất cả các client
        io.emit('chat message', msg);
    });

    // Xử lý sự kiện disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


//#region Giới Thiệu App
app.get('/', (req, res) => {
    console.log("")
    res.render(path.join(__dirname, 'views', 'hello-app.ejs')); // Gửi file ejs cho trình duyệt khi truy cập /login
})
//#endregion

// Khởi động server

server.listen(1001, () => {
    console.log('Server is running on port 1001');
});
