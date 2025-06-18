import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login"
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import MyApplications from "./Pages/MyApplications";
import AdminApplications from "./Pages/AdminApplications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-applications" element={<MyApplications/>} />
        <Route path = "/admin/applicants/:jobId" element={<AdminApplications/>} />
      </Routes>

    </Router>
  );
}

export default App;
