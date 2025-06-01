const generateJaaSToken = require("../utils/generateJaaSJWT");
const Request = require("../models/request");

const getCollabSpace = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId)
      .populate("school")
      .populate("volunteer");

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    if (request.status !== "Accepted") {
      return res.status(403).json({ msg: "Request not accepted yet" });
    }

    const roomName = `room-${request._id}`;
    const userName = req.user.name || "User"; // assuming you're using authentication

    const token = generateJaaSToken(roomName, userName);
    const meetingURL = `https://8x8.vc/${process.env.JAAS_APP_ID}/${roomName}#jwt=${token}`;

    res.json({
      meetingURL,
      school: request.school.name,
      volunteer: request.volunteer.name,
      roomName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = { getCollabSpace };
