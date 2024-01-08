import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
    name: String,
    type: String, 
    size: {
        x: Number,
        y: Number, 
    }, 
    duration:  Number, 
    Information:  String,
    Images: [{ type: String }] ,// Lưu trữ đường dẫn của ảnh
    status: { type: String, enum: ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'], default: 'Chưa xử lý' }
}, { timestamps: true });

const adEdit = mongoose.model('adEdit', adSchema);

export default adEdit;
