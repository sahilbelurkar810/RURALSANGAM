const User = require('../models/User.js');
const Volunteer = require('../models/Volunteer.js');
const School = require('../models/school.js');

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
    
        if (!user) return res.status(404).json({ msg: 'User not found' });
    
        let profile = null;
    
        if (user.role === 'volunteer') {
          profile = await Volunteer.findOne({ userId: user._id });
        } else if (user.role === 'school') {
          profile = await School.findOne({ userId: user._id });
        }
    
        res.json({ user, profile });
      } catch (err) {
        res.status(500).json({ msg: err.message });
      }
};

module.exports = {
    getCurrentUser,
};