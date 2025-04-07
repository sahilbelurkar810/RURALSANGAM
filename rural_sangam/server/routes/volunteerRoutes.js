const express = require('express');
const { getAllVolunteers, getVolunteerById, createVolunteer, updateVolunteerById, deleteVolunteerById } = require('../controllers/volunteerController.js');
const { protect, checkRole } = require('../middleware/auth.js');

const router = express.Router();

router.get('/', protect, getAllVolunteers);
router.get('/:id', protect,checkRole("volunteer"), getVolunteerById);
router.post('/', protect, checkRole("volunteer"),createVolunteer);
router.put('/:id', protect, checkRole("volunteer"),updateVolunteerById);
router.delete('/:id', protect, checkRole("volunteer"), deleteVolunteerById);

module.exports = router;