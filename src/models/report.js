import mongoose from "mongoose";
// Định nghĩa schema cho báo cáo
const reportSchema = new mongoose.Schema({
    adId: {type: String}, 
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Number: { type: String, required: true },
    Type: { type: String, required: true },
    Information: { type: String},
    Images: [{ type: String }] ,// Lưu trữ đường dẫn của ảnh
    status: { type: String, enum: ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'], default: 'Chưa xử lý' }
}, { timestamps: true });

// Tạo mô hình từ schema
const Report = mongoose.model('Report', reportSchema);

export default Report;
