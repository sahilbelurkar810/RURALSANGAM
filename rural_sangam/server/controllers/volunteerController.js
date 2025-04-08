const volunteer = require('../models/Volunteer.js');
const user = require('../models/User.js');

//let volunteer fill his data
const createVolunteer = async (req, res) => {
    try {
        const { name, email, phoneNumber, address, skills,dob,availability,contribution,acceptedSchool,education,requestedSchool } = req.body;
        const volunteerData = await volunteer.create({
            name,
            email,
            dob,
            phoneNumber,
            address,
            education,
            skills,
            availability,
            contribution,
            requestedSchool,
            acceptedSchool,
            isProfileComplete: true,
        });
        res.status(201).json({ msg: 'Volunteer details added successfully', volunteerData });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }else{
        res.status(500).json({ message: error.message });
        }
    }
}

//get all volunteers
const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await volunteer.find();
        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get volunteer by id
const getVolunteerById = async (req, res) => {
    try {
        const volunteerData = await volunteer.findById(req.params.id);
        const userData = await user.findOne({email: volunteerData.email});
        if (!volunteerData) return res.status(404).json({ msg: 'Volunteer not found' });

        // Authorization check
        if (volunteerData.email !== userData.email) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        res.status(200).json(volunteerData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//update volunteer by id
const updateVolunteerById = async (req, res) => {
    try {
        const volunteerData = await volunteer.findById(req.params.id);
        const userData = await user.findOne({email: volunteerData.email});
        if (!volunteerData) return res.status(404).json({ msg: 'Volunteer not found' });

        // Authorization check
        if (volunteerData.email !== userData.email) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        const updatedVolunteer = await volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedVolunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//delete volunteer by id
const deleteVolunteerById = async (req, res) => {
    try {
        const volunteerData = await volunteer.findById(req.params.id);
        const userData = await user.findOne({email: volunteerData.email});
        if (!volunteerData) return res.status(404).json({ msg: 'Volunteer not found' });

        // Authorization check
        if (volunteerData.email !== userData.email) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        await volunteer.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Volunteer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createVolunteer,
    getAllVolunteers,
    getVolunteerById,
    updateVolunteerById,
    deleteVolunteerById,
};