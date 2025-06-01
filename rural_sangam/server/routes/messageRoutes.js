const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesForRequest,
} = require("../controllers/messageController");
const protect = require("../middleware/auth").protect;

router.post("/", protect, sendMessage);
router.get("/:requestId", protect, getMessagesForRequest);

module.exports = router;
