const mongoose = require('mongoose');

const volunteerRequestSchema = new mongoose.Schema({
    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    requirementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Requirement', // We’ll create this later
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('VolunteerRequest', volunteerRequestSchema);
