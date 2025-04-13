const Notification = require("../models/notification");

const sendNotification = async ({ recipient, sender, message, link = "" }) => {
  const notification = new Notification({
    recipient,
    sender,
    message,
    link,
  });

  await notification.save();
};

module.exports = sendNotification;
