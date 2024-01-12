// advertisement.js
import mongoose from "mongoose";
const RequestAdSchema = new mongoose.Schema({
    location: String,
    ward: String,
    district: String,
    name: String,
    type: String,
    size: {
        x: Number,
        y: Number,
    },
    owner: String,
    ownerInfor: String,
    ownerEmail: String,
    ownerPhone: String,
    inforAd: String,

    date: Date,
    form: String,      // Trường hình thức
    category: String,
    duration: Number,
    address: String,
    Images: [Buffer],
    status: { type: String, enum: ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'], default: 'Chưa xử lý' }
    // Thêm các trường dữ liệu khác tùy thuộc vào yêu cầu của bạn
});

const RequestAd = mongoose.model('RequestAd', RequestAdSchema);

export default RequestAd;
