const express = require('express');
const { getAllSchools, getSchoolById, createSchool, updateSchoolById, deleteSchoolById } = require('../controllers/schoolController.js');
const { protect, checkRole } = require('../middleware/auth.js');
const router = express.Router();

router.get('/', protect, getAllSchools);
router.get('/:id', protect, checkRole("school"), getSchoolById);
router.post('/', protect, checkRole("school"), createSchool);
router.put('/:id', protect, checkRole("school"), updateSchoolById);
router.delete('/:id', protect, checkRole("school"), deleteSchoolById);

module.exports = router;