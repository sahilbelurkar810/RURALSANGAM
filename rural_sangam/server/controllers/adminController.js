const User = require("../models/User");
const School = require("../models/school");
const Volunteer = require("../models/Volunteer");
const Request = require("../models/request");

// 1. Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 2. Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("school", "schoolName")
      .populate("volunteers.volunteer", "fullName");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 3. Deactivate/Activate a user
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ msg: `User is now ${user.isActive ? "active" : "inactive"}` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 4. Stats (users, schools, volunteers, requests)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSchools = await School.countDocuments();
    const totalVolunteers = await Volunteer.countDocuments();
    const totalRequests = await Request.countDocuments();
    const activeRequests = await Request.countDocuments({ isOpen: true });

    res.json({
      totalUsers,
      totalSchools,
      totalVolunteers,
      totalRequests,
      activeRequests,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getAllUsers,
  getAllRequests,
  toggleUserActive,
  getStats,
};
