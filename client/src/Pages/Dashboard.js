import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
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
  }, [navigate, token]);

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
        status: "Applied",
        appliedDate: "",
        notes: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add job");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user?.name} ({user?.role})</h2>

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
            /><br /><br />

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              required
            /><br /><br />

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
            </select><br /><br />

            <input
              type="date"
              name="appliedDate"
              value={form.appliedDate}
              onChange={handleChange}
              required
            /><br /><br />

            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            /><br /><br />

            <button type="submit">Add Job</button>
          </form>

          <hr />
        </>
      )}

      <h3>{isAdmin ? "All Jobs" : "Your Jobs"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {jobs.length === 0 ? (
        <p>No jobs yet.</p>
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
