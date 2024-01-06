// middleware/.js
const checkAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 1) {
    return next(); // Cho phép tiếp tục xử lý nếu là admin
  }
  res.redirect('/'); // Chuyển hướng về trang chủ nếu không có quyền truy cập
};

export default checkAdmin;
