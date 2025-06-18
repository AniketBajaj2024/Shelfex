import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AdminApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applicants");
      }
    };

    fetchApplications();
  }, [jobId, token]);

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
        <ul>
          {applications.map((app) => (
  <li key={app._id} style={{ marginBottom: "1rem" }}>
    <strong>{app.applicant.name}</strong> ({app.applicant.email}) —
    <select
      value={app.status}
      onChange={(e) => handleStatusChange(app._id, e.target.value)}
      style={{ marginLeft: "1rem" }}
    >
      <option value="Applied">Applied</option>
      <option value="Interview">Interview</option>
      <option value="Offer">Offer</option>
      <option value="Accepted">Accepted</option>
      <option value="Rejected">Rejected</option>
    </select>
  </li>
))}

        </ul>
      )}
    </div>
  );
}
