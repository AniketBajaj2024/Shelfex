import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    appliedDate: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const jobsRes = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsRes.data);

        if (!isAdmin) {
          const appsRes = await axios.get(
            "http://localhost:5000/api/applications/my-applications",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const appliedJobIds = appsRes.data.map((app) => app.job._id);
          setApplications(appliedJobIds);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [navigate, token, isAdmin]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/jobs", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => [res.data, ...prev]);
      setForm({
        company: "",
        role: "",
        appliedDate: "",
        notes: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add job");
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/applications",
        { jobId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications((prev) => [...prev, jobId]);
      alert("Application submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>
        Welcome, {user?.name} ({user?.role})
      </h2>

      {isAdmin && (
        <>
          <h3>Add New Job</h3>
          <form onSubmit={handleAddJob}>
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <input
              type="date"
              name="appliedDate"
              value={form.appliedDate}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            />
            <br />
            <br />

            <button type="submit">Add Job</button>
          </form>

          <hr />
        </>
      )}

      <h3>{isAdmin ? "All Jobs" : "Available Jobs"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      console.log("Jobs:", {jobs.length});
      {jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id} style={{ marginBottom: "1rem" }}>
              <strong>{job.company}</strong> - {job.role}
              {!isAdmin && (
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => handleApply(job._id)}
                  disabled={applications.includes(job._id)}
                >
                  {applications.includes(job._id) ? "Applied" : "Apply"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isAdmin && (
        <div style={{ marginTop: "2rem" }}>
          <Link to="/my-applications">Go to My Applications</Link>
        </div>
      )}
    </div>
  );
}
