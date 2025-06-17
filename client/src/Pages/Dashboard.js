import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch jobs");
      }
    };

    fetchJobs();
  }, [navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {jobs.length === 0 ? (
        <p>No jobs yet</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <strong>{job.company}</strong> - {job.role} ({job.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
