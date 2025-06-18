import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AdminApplications() {
const [filterStatus, setFilterStatus] = useState("");
const [sortOrder, setSortOrder] = useState("");

  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filterStatus) queryParams.append("status", filterStatus);
        if (sortOrder) queryParams.append("sort", sortOrder);
  
        const res = await axios.get(
          `http://localhost:5000/api/applications/job/${jobId}?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applicants");
      }
    };
  
    fetchApplications();
  }, [jobId, token, filterStatus, sortOrder]);
  

  const jobTitle =
    applications.length > 0
      ? `${applications[0].job.company} - ${applications[0].job.role}`
      : "";

      const handleStatusChange = async (applicationId, newStatus) => {
        try {
          await axios.put(
            `http://localhost:5000/api/applications/${applicationId}`,
            { status: newStatus },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // Update local state
          setApplications((prev) =>
            prev.map((app) =>
              app._id === applicationId ? { ...app, status: newStatus } : app
            )
          );
        } catch (err) {
          alert("Failed to update status");
        }
      };
      

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem 2rem" }}>
    <div>
  <label>Status Filter: </label>
  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
    <option value="">All</option>
    <option value="Applied">Applied</option>
    <option value="Interview">Interview</option>
    <option value="Offer">Offer</option>
    <option value="Accepted">Accepted</option>
    <option value="Rejected">Rejected</option>
  </select>

  <label style={{ marginLeft: "1rem" }}>Sort By: </label>
  <select onChange={(e) => setSortOrder(e.target.value)}>
    <option value="">None</option>
    <option value="latest">Latest</option>
    <option value="oldest">Oldest</option>
  </select>
  
    <div style={{ padding: "2rem" }}>
      <h2>
        Applicants for Job:{" "}
        {jobTitle ? (
          <span>{jobTitle}</span>
        ) : (   
          <span style={{ color: "gray" }}>Loading...</span>
        )}
      </h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
  {applications.map((app) => (
    <div key={app._id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", backgroundColor: "#f5f5f5" }}>
      <h4>{app.applicant.name}</h4>
      <p><strong>Email:</strong> {app.applicant.email}</p>
      <p><strong>Status:</strong></p>
      <select
        value={app.status}
        onChange={(e) => handleStatusChange(app._id, e.target.value)}
        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }}
      >
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Accepted">Accepted</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  ))}
</div>

      )}
    </div>
    </div>  
    </div>
  );
}
