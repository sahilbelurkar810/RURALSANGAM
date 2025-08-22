const Room = require('../models/room');
const Request = require('../models/request');
const School = require('../models/school');
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

// Create a room when volunteer is accepted
const createRoom = async (requestId, volunteerId, schoolId, schoolUserId, volunteerUserId) => {
  try {
    const roomId = `room_${requestId}_${volunteerId}_${Date.now()}`;
    const jitsiRoomName = `RuralSangam_${roomId}`;

    const room = new Room({
      roomId,
      requestId,
      school: schoolId,
      volunteer: volunteerId,
      schoolUserId,
      volunteerUserId,
      jitsiRoomName,
      messages: []
    });

    await room.save();
    return room;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// Get user's rooms
const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    let rooms;
    if (user.role === 'school') {
      rooms = await Room.find({ schoolUserId: userId, isActive: true })
        .populate('requestId', 'requirementDescription')
        .populate('volunteer', 'name')
        .populate('volunteerUserId', 'name')
        .sort({ createdAt: -1 });
    } else {
      rooms = await Room.find({ volunteerUserId: userId, isActive: true })
        .populate('requestId', 'requirementDescription')
        .populate('school', 'name')
        .populate('schoolUserId', 'name')
        .sort({ createdAt: -1 });
    }

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get room details
const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await Room.findOne({ roomId })
      .populate('requestId', 'requirementDescription')
      .populate('school', 'name')
      .populate('volunteer', 'name')
      .populate('schoolUserId', 'name')
      .populate('volunteerUserId', 'name');

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if user has access to this room
    if (room.schoolUserId._id.toString() !== userId && room.volunteerUserId._id.toString() !== userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Send message in room
const sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if user has access to this room
    if (room.schoolUserId.toString() !== userId && room.volunteerUserId.toString() !== userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const newMessage = {
      sender: userId,
      senderName: user.name,
      senderRole: user.role,
      message: message.trim(),
      timestamp: new Date()
    };

    room.messages.push(newMessage);
    await room.save();

    res.json({ msg: 'Message sent', message: newMessage });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get messages (for polling)
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { lastMessageTime } = req.query;
    const userId = req.user.id;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if user has access to this room
    if (room.schoolUserId.toString() !== userId && room.volunteerUserId.toString() !== userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    let messages = room.messages;

    // If lastMessageTime is provided, return only newer messages
    if (lastMessageTime) {
      const lastTime = new Date(lastMessageTime);
      messages = room.messages.filter(msg => msg.timestamp > lastTime);
    }

    res.json({ messages, totalMessages: room.messages.length });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = {
  createRoom,
  getUserRooms,
  getRoomDetails,
  sendMessage,
  getMessages
};
