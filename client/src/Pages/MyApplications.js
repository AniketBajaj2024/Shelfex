import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchApplications = async () => {
      try {
        console.log("comes here1");

        const res = await axios.get("http://localhost:5000/api/applications/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("comes here");
        setApplications(res.data);
      } catch (err) {
        setError("Failed to load applications");
      }
    };

    fetchApplications();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Applications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied On</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.job?.company}</td>
                <td>{app.job?.role}</td>
                <td>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

