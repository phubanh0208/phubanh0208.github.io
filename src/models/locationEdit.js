import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    locationId:String,
    address: String,
    detail: String,
    type: String,
    condition: Number,
    Information: String,
    status: { type: String, enum: ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'], default: 'Chưa xử lý' }
}, { timestamps: true });

const locationEdit = mongoose.model('locationEdit', locationSchema);

export default locationEdit;
