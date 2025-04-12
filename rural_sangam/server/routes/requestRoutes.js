const express = require('express');
const { protect, checkRole } = require('../middleware/auth');
const {
    createRequest,
    getOpenRequests,
    applyToRequest,
    getMyRequests
} = require('../controllers/requestController');
const {volunteerCreateRequest} = require('../controllers/volunteerRequestController');

const router = express.Router();

// School creates request
router.post('/', protect, checkRole(['school']), createRequest);

// School sees own requests
router.get('/my', protect, checkRole(['school']), getMyRequests);

// Volunteer sees open requests
router.get('/open', protect, checkRole(['volunteer']), getOpenRequests);

// Volunteer applies to request
router.post('/apply/:id', protect, checkRole(['volunteer']), applyToRequest);

router.post('/volunteer/request', protect, checkRole(['volunteer']), volunteerCreateRequest);

module.exports = router;
