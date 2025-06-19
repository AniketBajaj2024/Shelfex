import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [sortOrder, setSortOrder] = useState("");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (sortOrder) queryParams.append("sort", sortOrder);

        const jobsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsRes.data);

        if (!isAdmin) {
          const appsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/applications/my-applications`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const appliedJobIds = appsRes.data.map((app) => app.job._id);
          setApplications(appliedJobIds);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [navigate, token, isAdmin, sortOrder]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/jobs`, form, {
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
        `${process.env.REACT_APP_API_URL}/api/applications`,
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

  const handleDeleteJob = async (jobId) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setJobs((prev) => prev.filter((job) => job._id !== jobId));
    alert("Job deleted successfully");
  } catch (err) {
    alert("Failed to delete job");
  }
};


  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
  <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
    Logout
  </button>
</div>
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
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #ccc" }}

            />
            <br /><br />

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #ccc" }}

            /><br /><br />


            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #ccc" }}

            /><br /><br />

              <input
              type="date"
              name="appliedDate"
              value={form.appliedDate}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #ccc" }}

            /><br /><br />

<button type="submit" style={{ padding: "0.6rem 1.2rem", borderRadius: "4px", backgroundColor: "#007bff", color: "white", border: "none" }}>
  Add Job
</button>
          </form>

          <hr />
        </>
      )}

      <h3>{isAdmin ? "All Jobs" : "Available Jobs"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Only Admin sees Sort dropdown */}
      {
        <div style={{ marginBottom: "1rem" }}>
          <label>Sort By: </label>
          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="">None</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      }

      {jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
  {jobs.map((job) => (
    <div key={job._id} style={{ border: "1px solid #e0e0e0", borderRadius: "12px", padding: "1rem", backgroundColor: "#ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>

      <h4>{job.company}</h4>
      <p><strong>Role:</strong> {job.role}</p>
      <p><strong>Applied Date:</strong> {new Date(job.appliedDate).toLocaleDateString()}</p>
      {job.notes && <p><strong>Notes:</strong> {job.notes}</p>}

      {!isAdmin ? (
        <button
          onClick={() => handleApply(job._id)}
          disabled={applications.includes(job._id)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            backgroundColor: applications.includes(job._id) ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            cursor: applications.includes(job._id) ? "not-allowed" : "pointer"
          }}
          
        >
          {applications.includes(job._id) ? "Applied" : "Apply"}
        </button>
      ) : (
        <Link to={`/admin/applicants/${job._id}`}>
          <button style={{ padding: "0.5rem 1rem", borderRadius: "4px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
  View Applicants
</button>
        <button onClick={() => handleDeleteJob(job._id)} style={{ marginLeft: "0.5rem", backgroundColor: "#dc3545", color: "white" }}>
      Delete
    </button>

        </Link>
      )}
    </div>
  ))}
</div>

      )}

      {!isAdmin && (
        <div style={{ marginTop: "2rem" }}>
          <Link to="/my-applications">Go to My Applications</Link>
        </div>
      )}
    </div>
  );
}
