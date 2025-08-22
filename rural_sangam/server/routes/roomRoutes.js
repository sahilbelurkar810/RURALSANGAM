const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getUserRooms,
  getRoomDetails,
  sendMessage,
  getMessages,
} = require("../controllers/roomController");

const router = express.Router();

// Get user's rooms
router.get("/my-rooms", protect, getUserRooms);

// Get room details
router.get("/:roomId", protect, getRoomDetails);

// Send message in room
router.post("/:roomId/message", protect, sendMessage);

// Get messages (for polling)
router.get("/:roomId/messages", protect, getMessages);

module.exports = router;
