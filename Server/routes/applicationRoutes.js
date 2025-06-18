const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { applyToJob, getApplicationsForJob, getMyApplications } = require("../controllers/applicationController");



router.post("/", authMiddleware, applyToJob);
router.get("/", authMiddleware, getApplicationsForJob); // Protected by default
router.get("/my-applications", authMiddleware, getMyApplications);
router.get("/job/:jobId", authMiddleware, getApplicationsForJob);



module.exports = router;
