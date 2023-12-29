// advertisement.js
import mongoose from "mongoose";
const advertisementSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: {
    x: Number,
    y: Number,
  },
  address: String,
  owner: String,
  // Thêm các trường dữ liệu khác tùy thuộc vào yêu cầu của bạn
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

export default Advertisement;
