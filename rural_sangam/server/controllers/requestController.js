const School = require("../models/school");
const Request = require("../models/request");
const Volunteer = require("../models/Volunteer");
const sendNotification = require("../utils/sendNotification");
const User = require("../models/User");

const createRequest = async (req, res) => {
  try {
    const {
      requirementDescription,
      requiredSkills,
      requiredVolunteers,
      timings,
      duration,
    } = req.body;

    // Find the school associated with the logged-in user
    const school = await School.findOne({ userId: req.user.id });

    if (!school) {
      return res.status(404).json({ msg: "School profile not found" });
    }

    // Create request
    const newRequest = new Request({
      requirementDescription,
      requiredSkills,
      requiredVolunteers,
      timings,
      duration,
      school: school._id, // Automatically set from logged-in user
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Volunteer sees open requests
const getOpenRequests = async (req, res) => {
  try {
    const requests = await Request.find({ isOpen: true }).populate(
      "school",
      "schoolName location"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Volunteer applies to a request
const applyToRequest = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    if (!volunteer) {
      return res.status(404).json({ msg: "Volunteer not found" });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // Debugging: Log the current volunteers in the request
    console.log("Current volunteers:", request.volunteers);

    // Check if the volunteer has already applied
    const existingApplication = request.volunteers.some((v) => {
      console.log(
        "Checking volunteer:",
        v.volunteer?.toString(),
        "against",
        volunteer._id.toString()
      );
      return v.volunteer && v.volunteer.toString() === volunteer._id.toString();
    });

    // Debugging: Log the result of the check
    console.log("Existing application:", existingApplication);

    if (existingApplication) {
      return res.status(400).json({ msg: "Already applied to this request" });
    }

    const schoolUser = await School.findById(request.school);
    if (!schoolUser) {
      return res.status(404).json({ msg: "School user not found" });
    }

    // Add the volunteer to the request
    request.volunteers.push({ volunteer: volunteer._id, status: "pending" });
    await request.save();

    // Debugging: Log the updated volunteers array
    console.log("Updated volunteers:", request.volunteers);

    // Send a notification to the school
    await sendNotification({
      recipient: schoolUser.userId,
      sender: req.user.id,
      message: `New volunteer ${volunteer.name} applied to your request.`,
      link: `/school-dashboard/requests/${request._id}`,
    });

    res.json({ msg: "Applied to request" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// School views their posted requests
const getMyRequests = async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    const requests = await Request.find({ school: school._id }).populate(
      "volunteers"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get volunteers applied to a request
const getVolunteersForRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("volunteers.volunteer", "fullName skills") // populate volunteer details
      .populate("school", "schoolName");

    if (!request) return res.status(404).json({ msg: "Request not found" });

    // Check if logged-in school owns the request
    const school = await School.findOne({ userId: req.user.id });
    if (!school || request.school._id.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(request.volunteers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Accept or reject a volunteer
const updateVolunteerStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const request = await Request.findById(req.params.requestId);

    const school = await School.findOne({ userId: req.user.id });
    if (!school || request.school.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const volunteerEntry = request.volunteers.find(
      (v) => v.volunteer.toString() === req.params.volunteerId
    );

    if (!volunteerEntry)
      return res.status(404).json({ msg: "Volunteer not found in request" });

    volunteerEntry.status = status;
    await request.save();
    await sendNotification({
      recipient: volunteerEntry.volunteer,
      sender: req.user.id,
      message: `Your application for "${request.requirementDescription}" was ${status}.`,
      link: `/volunteer-dashboard/requests/${request._id}`,
    });
    res.json({ msg: `Volunteer ${status} successfully` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createRequest,
  getOpenRequests,
  applyToRequest,
  getMyRequests,
  getVolunteersForRequest,
  updateVolunteerStatus,
};
