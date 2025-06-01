const express = require('express');
const { protect, checkRole } = require('../middleware/auth');
const {
    createRequest,
    getOpenRequests,
    applyToRequest,
    getMyRequests,
    getVolunteersForRequest,
    updateVolunteerStatus,
    getMyApplications,
    updateRequest,
    deleteRequest,
    closeRequest,
    withdrawApplication,
    getAcceptedRequestsForVolunteer,
    markRequestCompleted,
    getCollaborationRoom
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
router.get(
  "/:id/volunteers",
  protect,
  checkRole(["school"]),
  getVolunteersForRequest
);
router.patch(
  "/:requestId/volunteer/:volunteerId",
  protect,
  checkRole(["school"]),
  updateVolunteerStatus
);
router.get("/volunteer/my-applications", protect, getMyApplications);
router.put("/:id", protect, checkRole(["school"]), updateRequest);
router.delete("/:id", protect, checkRole(["school"]), deleteRequest);
router.patch("/:id/close", protect, checkRole(["school"]), closeRequest);
router.patch("/:id/withdraw", protect, checkRole(["volunteer"]), withdrawApplication);
router.get("/volunteer/accepted", protect, checkRole(["volunteer"]), getAcceptedRequestsForVolunteer);
router.patch("/:id/completed", protect, checkRole(["school"]), markRequestCompleted);
router.get("/:id/collaboration/:volunteerId", protect, getCollaborationRoom);
module.exports = router;
