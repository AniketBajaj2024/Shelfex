const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// 👇 CORS Setup
const allowedOrigins = [
  'http://localhost:3000',
  'https://shelfex-aniketbajaj2024s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Tracker API is running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server started on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log("DB Connection Error:", err.message));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
