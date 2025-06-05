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

    const school = await School.findOne({ userId: req.user.id });

    if (!school) {
      return res.status(404).json({ msg: "School profile not found" });
    }

    const newRequest = new Request({
      requirementDescription,
      requiredSkills,
      requiredVolunteers, 
      timings,
      duration,
      school: school._id,
      isOpen: true
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getOpenRequests = async (req, res) => {
  try {
    const { skills, location } = req.query;

    let filter = {
      isOpen: true
    };

    if (skills) {
      const skillArray = skills.split(",").map(skill => skill.trim().toLowerCase());
      filter.requiredSkills = { $in: skillArray };
    }

    if (location) {
      const schoolsInLocation = await School.find({
        location: new RegExp(location, "i")
      }).select("_id");
      filter.school = { $in: schoolsInLocation.map(s => s._id) };
    }

    const requests = await Request.find(filter)
      .populate("school", "schoolName location");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

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

    if (!request.isOpen) {
      return res.status(400).json({ msg: "This request is closed" });
    }

    const existingApplication = request.volunteers.some(v => 
      v.volunteer && v.volunteer.toString() === volunteer._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({ msg: "Already applied to this request" });
    }

    const school = await School.findById(request.school);
    if (!school) {
      return res.status(404).json({ msg: "School not found" });
    }

    request.volunteers.push({ volunteer: volunteer._id, status: "pending" });
    await request.save();

    await sendNotification({
      recipient: school.userId,
      sender: req.user.id,
      message: `New volunteer ${volunteer.name} applied to your request.`,
      link: `/school-dashboard/requests/${request._id}`
    });

    res.json({ msg: "Applied to request successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ msg: "School profile not found" });
    }

    const filter = { school: school._id };
    if (req.query.status === "open") filter.isOpen = true;
    else if (req.query.status === "closed") filter.isOpen = false;

    const requests = await Request.find(filter)
      .populate("volunteers.volunteer", "fullName skills")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getVolunteersForRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("volunteers.volunteer", "fullName skills")
      .populate("school", "schoolName");

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    const school = await School.findOne({ userId: req.user.id });
    if (!school || request.school._id.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(request.volunteers);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const updateVolunteerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    const school = await School.findOne({ userId: req.user.id });
    if (!school || request.school.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const volunteerEntry = request.volunteers.find(
      v => v.volunteer && v.volunteer.toString() === req.params.volunteerId
    );

    if (!volunteerEntry) {
      return res.status(404).json({ msg: "Volunteer not found in request" });
    }

    volunteerEntry.status = status;

    const acceptedCount = request.volunteers.filter(v => v.status === "accepted").length;
    if (status === "accepted" && acceptedCount + 1 >= request.requiredVolunteers) {
      request.isOpen = false;
    }

    await request.save();

    await sendNotification({
      recipient: volunteerEntry.volunteer,
      sender: req.user.id,
      message: `Your application for "${request.requirementDescription}" was ${status}.`,
      link: `/volunteer-dashboard/requests/${request._id}`
    });

    res.json({ msg: `Volunteer ${status} successfully` });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    if (!volunteer) {
      return res.status(404).json({ msg: "Volunteer not found" });
    }

    const requests = await Request.find({
      "volunteers.volunteer": volunteer._id
    })
    .populate("school", "name address")
    .select("requirementDescription requiredSkills timings duration volunteers isOpen");

    const myApplications = requests.map(reqItem => {
      const myStatus = reqItem.volunteers.find(
        v => v.volunteer && v.volunteer.toString() === volunteer._id.toString()
      );

      return {
        requestId: reqItem._id,
        requirementDescription: reqItem.requirementDescription,
        requiredSkills: reqItem.requiredSkills,
        timings: reqItem.timings,
        duration: reqItem.duration,
        school: reqItem.school,
        isOpen: reqItem.isOpen,
        status: myStatus?.status || "unknown"
      };
    });

    res.json(myApplications);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      requirementDescription,
      requiredSkills,
      requiredVolunteers,
      timings, 
      duration
    } = req.body;

    const school = await School.findOne({ userId: req.user.id });
    if (!school) {
      return res.status(404).json({ msg: "School not found" });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    if (request.school.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (request.volunteers.length > 0) {
      return res.status(400).json({ msg: "Cannot edit request after volunteers have applied" });
    }

    if (requirementDescription) request.requirementDescription = requirementDescription;
    if (requiredSkills) request.requiredSkills = requiredSkills;
    if (requiredVolunteers) request.requiredVolunteers = requiredVolunteers;
    if (timings) request.timings = timings;
    if (duration) request.duration = duration;

    await request.save();
    res.json({ msg: "Request updated successfully", request });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findOne({ userId: req.user.id });

    if (!school) {
      return res.status(404).json({ msg: "School not found" });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    if (request.school.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (request.volunteers.length > 0) {
      return res.status(400).json({ msg: "Cannot delete request after volunteers have applied" });
    }

    await Request.findByIdAndDelete(id);
    res.json({ msg: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const closeRequest = async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    const request = await Request.findById(req.params.id);

    if (!request || request.school.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to close this request" });
    }

    if (!request.isOpen) {
      return res.status(400).json({ msg: "Request is already closed" });
    }

    request.isOpen = false;
    await request.save();

    res.json({ msg: "Request closed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const withdrawApplication = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    if (!volunteer) {
      return res.status(404).json({ msg: "Volunteer not found" });
    }

    const request = await Request.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    if (!request.isOpen) {
      return res.status(400).json({ msg: "Cannot withdraw from closed request" });
    }

    const index = request.volunteers.findIndex(
      v => v.volunteer.toString() === volunteer._id.toString()
    );

    if (index === -1) {
      return res.status(404).json({ msg: "Application not found" });
    }

    if (request.volunteers[index].status !== "pending") {
      return res.status(400).json({ msg: "Cannot withdraw after decision" });
    }

    request.volunteers.splice(index, 1);
    await request.save();

    res.json({ msg: "Application withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  createRequest,
  getOpenRequests,
  applyToRequest,
  getMyRequests,
  getVolunteersForRequest,
  updateVolunteerStatus,
  getMyApplications,
  updateRequest,
  deleteRequest,
  closeRequest,
  withdrawApplication
};
