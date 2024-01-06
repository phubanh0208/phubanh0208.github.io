// user.js
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: String,
  role: Number,
  ward: String,
  district: String
  // Thêm các trường khác nếu cần
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;
