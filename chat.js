const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

const videosDirectory = path.join(__dirname, 'public', 'videos');

// Cấu hình EJS làm trình động mặc định cho Express
app.set('view engine', 'ejs');

// Middleware để xử lý dữ liệu gửi từ form
app.use(express.urlencoded({ extended: true }));


// Phục vụ tập tin video từ thư mục public/videos
app.use('/videos', express.static(videosDirectory));

// Endpoint GET để phục vụ tập tin video
app.get('/video/:filename', function(req, res) {
  const filename = req.params.filename;
  console.log( filename )
  const videoPath = path.join(videosDirectory, filename);

  // Kiểm tra xem tập tin video có tồn tại không
  if (fs.existsSync(videoPath)) {
    // Phục vụ tập tin video
    res.sendFile(videoPath);
  } else {
    // Trả về mã lỗi 404 nếu tập tin không tồn tại
    res.status(404).send('File not found');
  }
});

// Khi có kết nối mới
io.on('connection', (socket) => {
  console.log('A user connected');

  // Nhận sự kiện đăng ký từ client
  socket.on('register', (username) => {
    socket.username = username;
  });

  // Nhận tin nhắn chat từ client và gửi lại cho tất cả các client khác
  socket.on('chat message', (msg) => {
    if (socket.username) {
      io.emit('chat message', { username: socket.username, message: msg });
    }
  });

  // Khi một người dùng ngắt kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

http.listen(8000, function() {
  console.log('Server is running on port 8000');
});