import mongoose from "mongoose";
// Định nghĩa schema cho báo cáo
const reportSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Number: { type: String, required: true },
    Type: { type: String, required: true },
    Information: { type: String},
    ward: String,
    district: String,
    address: String,
    coordinates: {
        x:Number,
        y:Number,
      },
      Solution:  { type: String },

      Images: [Buffer],
    status: { type: String, enum: ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'], default: 'Chưa xử lý' }
}, { timestamps: true });

// Tạo mô hình từ schema
const ReportLocation = mongoose.model('ReportLocation', reportSchema);

export default ReportLocation;
