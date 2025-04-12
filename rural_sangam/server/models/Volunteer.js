const mongoose = require('mongoose');

const Register = require('./User.js')

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    availability: {
        type: String,
        required: true,
    },
    contribution: {
        type: String,
        required: true,
    },
    requestedSchool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
    },
    acceptedSchool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

volunteerSchema.pre('save', async function (next) {
    if (this.isNew) {
        const registerData = await Register.findOne({ email: this.email });
        if (!registerData) {
            return next(new Error('No user found with the provided email.'));
        }
        this.email = registerData.email; 
    }
    next();
});

// Avoid OverwriteModelError
const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;