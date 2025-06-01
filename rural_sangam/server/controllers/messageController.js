const Message = require("../models/message");
const Request = require("../models/request");
const Volunteer = require("../models/Volunteer");
const School = require("../models/school");

const sendMessage = async (req, res) => {
  try {
    const { requestId, recipientId, content } = req.body;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    const senderId = req.user.id;

    const isVolunteer = request.volunteers.some(
      (v) => v.volunteer?.toString() === senderId && v.status === "accepted"
    );
    const isSchool = request.school.toString() === req.user.profileId;

    if (!isVolunteer && !isSchool) {
      return res
        .status(403)
        .json({ msg: "Not authorized to send messages for this request" });
    }

    const message = new Message({
      request: requestId,
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();

    res.status(201).json({ msg: "Message sent", message });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getMessagesForRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const messages = await Message.find({ request: requestId })
      .sort({ createdAt: 1 })
      .populate("sender", "fullName role")
      .populate("recipient", "fullName role");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  sendMessage,
  getMessagesForRequest,
};
