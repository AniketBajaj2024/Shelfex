const Application = require("../models/Application");

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Applicant only)
const getApplicationsForJob = async (req, res) => {
  const { jobId } = req.params;
  const { status, sort } = req.query;

  const filter = { job: jobId };
  if (status) filter.status = status;

  try {
    let query = Application.find(filter)
      .populate("applicant", "name email")
      .populate("job", "company role");

    if (sort === "latest") query = query.sort({ createdAt: -1 });
    else if (sort === "oldest") query = query.sort({ createdAt: 1 });

    const applications = await query;
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  applyToJob,
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus
};
