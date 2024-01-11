import mongoose from "mongoose";
// Định nghĩa schema cho báo cáo
const reportSchema = new mongoose.Schema({
    adId: { type: String },
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Number: { type: String, required: true },
    Type: { type: String, required: true },
    ward: String,
    district: String,
    address: String,
    coordinates: {
        x:Number,
        y:Number,
      },
    Information: { type: String },
    Solution:  { type: String },
    Images: [ Buffer ],
    status: { type: String, enum: ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'], default: 'Chưa xử lý' }
}, { timestamps: true });

// Tạo mô hình từ schema
const Report = mongoose.model('Report', reportSchema);

export default Report;
