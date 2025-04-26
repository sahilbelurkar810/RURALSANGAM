const volunteer = require("../models/Volunteer.js");
const user = require("../models/User.js");

//let volunteer fill his data
const createVolunteer = async (req, res) => {
  try {
    console.log("Creating volunteer with data:", req.body);
    console.log("User ID from auth:", req.user.id);

    const {
      name,
      email,
      phoneNumber,
      address,
      skills,
      dob,
      availability,
      contribution,
      acceptedSchool,
      education,
      requestedSchool,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !address ||
      !dob ||
      !education ||
      !availability
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure skills is an array
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    // Create volunteer record
    const volunteerData = await volunteer.create({
      userId: req.user.id,
      name,
      email,
      dob,
      phoneNumber,
      address,
      education,
      skills,
      availability,
      contribution,
      requestedSchool,
      acceptedSchool,
      isProfileComplete: true,
    });

    console.log("Volunteer created successfully:", volunteerData);
    res
      .status(201)
      .json({ msg: "Volunteer details added successfully", volunteerData });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    } else if (error.name === "ValidationError") {
      // Mongoose validation error - missing required fields or wrong types
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
        details: error.message,
      });
    } else {
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  }
};

//get all volunteers
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get volunteer by id
const getVolunteerById = async (req, res) => {
  try {
    const volunteerData = await volunteer.findById(req.params.id);
    if (!volunteerData)
      return res.status(404).json({ msg: "Volunteer not found" });

    const userData = await user.findOne({ email: volunteerData.email });
    if (!userData)
      return res.status(404).json({ msg: "User not found for this volunteer" });

    // Authorization check
    if (volunteerData.email !== userData.email) {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.status(200).json(volunteerData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update volunteer by id
const updateVolunteerById = async (req, res) => {
  try {
    console.log("Updating volunteer with data:", req.body);
    console.log("Volunteer ID:", req.params.id);

    const volunteerData = await volunteer.findById(req.params.id);
    if (!volunteerData)
      return res.status(404).json({ msg: "Volunteer not found" });

    const userData = await user.findOne({ email: volunteerData.email });
    if (!userData)
      return res.status(404).json({ msg: "User not found for this volunteer" });

    // Authorization check
    if (volunteerData.email !== userData.email) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const updatedVolunteer = await volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    console.log("Volunteer updated successfully:", updatedVolunteer);
    res.status(200).json(updatedVolunteer);
  } catch (error) {
    console.error("Error updating volunteer:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
        details: error.message,
      });
    }
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

//delete volunteer by id
const deleteVolunteerById = async (req, res) => {
  try {
    const volunteerData = await volunteer.findById(req.params.id);
    if (!volunteerData)
      return res.status(404).json({ msg: "Volunteer not found" });

    const userData = await user.findOne({ email: volunteerData.email });
    if (!userData)
      return res.status(404).json({ msg: "User not found for this volunteer" });

    // Authorization check
    if (volunteerData.email !== userData.email) {
      return res.status(403).json({ msg: "Access denied" });
    }

    await volunteer.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerById,
  deleteVolunteerById,
};
