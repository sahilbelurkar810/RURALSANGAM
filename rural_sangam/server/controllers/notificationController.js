const Notification = require("../models/notification");

const getNotifications = async (req, res) => {
  try {
    console.log(req.user.id);
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .populate("sender", "name email");

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await Notification.findById(notificationId);

    if (!notification || notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ msg: "Marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getNotifications, markAsRead };
