const mongoose = require('mongoose');
const User = require('./User.js')

const schoolSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  volunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
  ],
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
});


schoolSchema.pre('save', async function (next) {
    if (this.isNew) {
        const registerData = await User.findOne({ email: this.email });
        if (registerData) {
            this.email = registerData.email;
            
        }
    }
    next();
});

module.exports = mongoose.model('School', schoolSchema);