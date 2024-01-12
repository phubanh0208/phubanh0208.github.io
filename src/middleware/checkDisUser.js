// middleware/.js
const checkAdmin2 = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 2) {
      return next(); // Cho phép tiếp tục xử lý nếu là admin
    }
    res.redirect('/'); // Chuyển hướng về trang chủ nếu không có quyền truy cập
  };
  
  export default checkAdmin2;
  