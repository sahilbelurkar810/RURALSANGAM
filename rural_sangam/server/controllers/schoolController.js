const school = require('../models/school.js');

const createSchool = async (req, res) => {
    try {
        const { name, email, phoneNumber, address, description } = req.body;
        const schoolData = await school.create({
          userId: req.user.id,
          name,
          email,
          phoneNumber,
          address,
          description,
        });
        res.status(201).json({ msg: 'School details added successfully', schoolData });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

const getAllSchools = async (req, res) => {
    try {
        const schools = await school.find();
        res.status(200).json(schools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSchoolById = async (req, res) => {
    try {
        const schoolData = await school.findById(req.params.id);
        if (!schoolData) return res.status(404).json({ msg: 'School not found' });
        res.status(200).json(schoolData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateSchoolById = async (req, res) => {
    try {
        const { name, email, phoneNumber, address, description } = req.body;
        const schoolData = await school.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phoneNumber,
            address,
            description,
        }, { new: true });
        if (!schoolData) return res.status(404).json({ msg: 'School not found' });
        res.status(200).json({ msg: 'School details updated successfully', schoolData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteSchoolById = async (req, res) => {
    try {
        const schoolData = await school.findByIdAndDelete(req.params.id);
        if (!schoolData) return res.status(404).json({ msg: 'School not found' });
        res.status(200).json({ msg: 'School details deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createSchool,
    getAllSchools,
    getSchoolById,
    updateSchoolById,
    deleteSchoolById,
}