const router = require("express").Router();
const {protect,checkRole} = require("../middleware/auth"); // JWT middleware
const {getAllUsers,getAllRequests,getStats,toggleUserActive} = require("../controllers/adminController");

router.get("/users", protect, checkRole(["admin"]), getAllUsers);
router.get("/requests", protect, checkRole(["admin"]), getAllRequests);
router.get("/stats", protect, checkRole(["admin"]), getStats);
router.put("/toggle/:userId", protect, checkRole(["admin"]), toggleUserActive);

module.exports = router;