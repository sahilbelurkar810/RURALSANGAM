const mongoose = require('mongoose');
const School = require('./school.js');
const User = require('./User.js');

const requestSchema = new mongoose.Schema(
  {
    requirementDescription: {
      type: String,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    requiredSkills: {
      type: [String],
      required: true,
    },
    requiredVolunteers: {
      type: Number,
      required: true,
    },
    timings: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    volunteers: [
      {
        volunteer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Volunteer",
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);