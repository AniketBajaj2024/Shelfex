const Application = require("../models/Application");

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Applicant only)
const getApplicationsForJob = async (req, res) => {
    const { jobId } = req.params;
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  
    try {

      if (!jobId) {
        console.log({jobId});
        return res.status(400).json({ message: "Job ID is required" },);
      }

      console.log("Fetching applications for job:", jobId);
      const applications = await Application.find({ job: jobId })
        .populate("applicant", "name email")
        .populate("job", "company role");
  
      res.status(200).json(applications);
    } catch (err) {
      res.status(500).json({ message: "Error fetching applications" });
    }
  };

// @desc    Get logged-in applicant's applications
// @route   GET /api/my-applications
// @access  Private (Applicant)
const getMyApplications = async (req, res) => {
    try {
      const applications = await Application.find({ applicant: req.user.id })
        .populate("job", "company role");
  
      res.status(200).json(applications);
    } catch (err) {
      console.error("Error in getMyApplications:", err.message);
      res.status(500).json({ message: "Error fetching your applications" });
    }
  };
  
const applyToJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    // prevent duplicate applications
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

    // @desc    Get applications for a job
};

module.exports = {
  applyToJob,
  getApplicationsForJob,
  getMyApplications
};
