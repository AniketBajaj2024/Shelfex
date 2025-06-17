const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId,
            ref: "User", required: true 
        },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ["Applied", "Interview", "Offer", "Rejected", "Accepted"],
    default: "Applied",
  },
  appliedDate: { type: Date, required: true },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);