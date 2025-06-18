const Job = require("../models/Job");

// Create new job
exports.createJob = async (req, res) => {
  const { company, role, status, appliedDate, notes } = req.body;

  try {
    const job = new Job({
      userId: req.user.id,
      company,
      role,
      status,
      appliedDate,
      notes,
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all jobs for user (with optional filters)
// Get all jobs
exports.getJobs = async (req, res) => {
  const { status, sort } = req.query;
  const filter = {};

  // Admin sees only their own jobs
  if (req.user.role === "admin") {
    filter.userId = req.user.id;
  }

  if (status) {
    filter.status = status;
  }

  try {
    let query = Job.find(filter);

    if (sort === "latest") {
      query = query.sort({ appliedDate: -1 });
    } else if (sort === "oldest") {
      query = query.sort({ appliedDate: 1 });
    }

    const jobs = await query;
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
    try {
      const job = await Job.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });
  
      if (!job) return res.status(404).json({ message: "Job not found" });
  
      res.status(200).json({ message: "Job deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };