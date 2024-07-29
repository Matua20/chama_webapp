const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  idNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  uniqueId: { type: String, required: true, unique: true },
  level: { type: Number, default: 0 },
  contributions: [{ amount: Number, date: Date }],
  gifts: [{ amount: Number, date: Date, confirmed: { type: Boolean, default: false } }],
  giftedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
