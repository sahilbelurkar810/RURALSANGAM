const VolunteerRequest = require("../models/volunteerRequest");
const Volunteer = require("../models/Volunteer");

const volunteerCreateRequest = async (req, res) => {
  try {
    const { schoolId, requirementId } = req.body;

    // Get volunteer ID from user context
    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    if (!volunteer) return res.status(404).json({ msg: "Volunteer not found" });

    // Prevent duplicate
    const exists = await VolunteerRequest.findOne({
      volunteerId: volunteer._id,
      requirementId,
    });

    if (exists) return res.status(400).json({ msg: "Already requested" });

    const newRequest = await VolunteerRequest.create({
      volunteerId: volunteer._id,
      schoolId,
      requirementId,
    });

    res.status(201).json({ msg: "Request sent", request: newRequest });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  volunteerCreateRequest,
};
