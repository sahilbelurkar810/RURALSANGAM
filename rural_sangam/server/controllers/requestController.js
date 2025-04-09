const School = require('../models/school');
const Request = require('../models/request');
const Volunteer = require('../models/volunteer');


const createRequest = async (req, res) => {
    try {
        const school = await School.findOne({ userId: req.user.id });
        if (!school) return res.status(404).json({ msg: 'School not found' });

        const { requirementDescription, requiredSkills, requiredVolunteers, timings, duration } = req.body;

        const newRequest = await Request.create({
            requirementDescription,
            school: school._id,
            requiredSkills,
            requiredVolunteers,
            timings,
            duration
        });

        res.status(201).json({ msg: 'Request created', request: newRequest });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Volunteer sees open requests
const getOpenRequests = async (req, res) => {
    try {
        const requests = await Request.find({ isOpen: true }).populate('school', 'schoolName location');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Volunteer applies to a request
const applyToRequest = async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ userId: req.user.id });
        if (!volunteer) return res.status(404).json({ msg: 'Volunteer not found' });

        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        if (request.volunteers.includes(volunteer._id)) {
            return res.status(400).json({ msg: 'Already applied' });
        }

        request.volunteers.push(volunteer._id);
        await request.save();

        res.json({ msg: 'Applied to request' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// School views their posted requests
const getMyRequests = async (req, res) => {
    try {
        const school = await School.findOne({ userId: req.user.id });
        const requests = await Request.find({ school: school._id }).populate('volunteers');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    createRequest,
    getOpenRequests,
    applyToRequest,
    getMyRequests
};