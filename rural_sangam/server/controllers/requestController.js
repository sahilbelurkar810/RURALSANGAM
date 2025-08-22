const School = require("../models/school");
const Request = require("../models/request");
const Volunteer = require("../models/Volunteer");
const sendNotification = require("../utils/sendNotification");
const User = require("../models/User");
const { createRoom } = require("./roomController");

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
    res.status(500).json({ msg: "Server error", error: err.message });
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

    if (!school) {
      return res.status(404).json({ msg: "School profile not found" });
    }

    const requests = await Request.find({ school: school._id })
      .populate("volunteers.volunteer", "name skills")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get volunteers applied to a request
const getVolunteersForRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate(
        "volunteers.volunteer",
        "name email phoneNumber address education skills availability dob contribution"
      ) // populate complete volunteer details
      .populate("school", "name");

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
      (v) => v.volunteer && v.volunteer.toString() === req.params.volunteerId
    );

    if (!volunteerEntry)
      return res.status(404).json({ msg: "Volunteer not found in request" });

    volunteerEntry.status = status;

    // 👇 Count accepted volunteers
    const acceptedCount = request.volunteers.filter(
      (v) => v.status === "accepted"
    ).length;

    // 👇 Update isOpen if accepted count matches required
    if (
      status === "accepted" &&
      acceptedCount + 1 >= request.requiredVolunteers
    ) {
      request.isOpen = false;
    }

    await request.save();

    // 🆕 Create room if volunteer is accepted
    if (status === "accepted") {
      try {
        const volunteer = await Volunteer.findById(req.params.volunteerId);
        const room = await createRoom(
          request._id,
          volunteer._id,
          school._id,
          req.user.id, // school user ID
          volunteer.userId // volunteer user ID
        );
        console.log(`Room created: ${room.roomId}`);
      } catch (roomError) {
        console.error("Error creating room:", roomError);
        // Don't fail the approval if room creation fails
      }
    }

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

const getMyApplications = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    if (!volunteer) {
      return res.status(404).json({ msg: "Volunteer not found" });
    }

    const requests = await Request.find({
      "volunteers.volunteer": volunteer._id,
    })
      .populate("school", "name address")
      .select(
        "requirementDescription requiredSkills timings duration volunteers"
      );

    // Filter only this volunteer's status
    const myApplications = requests.map((reqItem) => {
      const myStatus = reqItem.volunteers.find(
        (v) =>
          v.volunteer && v.volunteer.toString() === volunteer._id.toString()
      );

      return {
        requestId: reqItem._id,
        requirementDescription: reqItem.requirementDescription,
        requiredSkills: reqItem.requiredSkills,
        timings: reqItem.timings,
        duration: reqItem.duration,
        school: reqItem.school,
        isOpen: req.isOpen,
        status: myStatus?.status || "unknown",
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
    const school = await School.findOne({ userId: req.user.id });

    if (!school) return res.status(404).json({ msg: "School not found" });

    const request = await Request.findById(id);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    // Only the owner school can update
    if (request.school.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Prevent update if volunteers already applied
    if (request.volunteers.length > 0) {
      return res
        .status(400)
        .json({ msg: "Cannot edit request after volunteers have applied" });
    }

    // Update fields
    const updatableFields = [
      "requirementDescription",
      "requiredSkills",
      "requiredVolunteers",
      "timings",
      "duration",
    ];

    // updatableFields.forEach((field) => {
    //   if (req.body[field]) {
    //     request[field] = req.body[field];
    //   }
    // });
    // Update only if fields are provided
    if (requirementDescription)
      request.requirementDescription = requirementDescription;
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

    if (!school) return res.status(404).json({ msg: "School not found" });

    const request = await Request.findById(id);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    if (request.school.toString() !== school._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (request.volunteers.length > 0) {
      return res
        .status(400)
        .json({ msg: "Cannot delete request after volunteers have applied" });
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
      return res
        .status(403)
        .json({ msg: "Not authorized to close this request" });
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
      return res
        .status(400)
        .json({ msg: "Cannot withdraw from closed request" });
    }

    const index = request.volunteers.findIndex(
      (v) => v.volunteer.toString() === volunteer._id.toString()
    );

    if (index === -1) {
      return res.status(404).json({ msg: "Application not found" });
    }

    if (request.volunteers[index].status !== "pending") {
      return res.status(400).json({ msg: "Cannot withdraw after decision" });
    }

    // Remove the volunteer from the list
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
  withdrawApplication,
};
