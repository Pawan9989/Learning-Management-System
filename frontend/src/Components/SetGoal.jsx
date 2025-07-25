import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useLocation } from "react-router-dom";

function SetGoal() {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const location = useLocation();
  const courseId = location.state?.courseId || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !targetDate) {
      setError("Please fill all fields.");
      return;
    }
    console.log({ userId, title, targetDate, courseId });
await fetch("http://localhost:8085/api/goals", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId, title, targetDate, courseId }),
});
    navigate("/my-dashboard");
    window.location.reload();
  }; // <-- This closing brace was missing

  return (
    <div>
      <Navbar page="dashboard" />
      <div className="container" style={{ marginTop: 30 }}>
        <h2>Set a New Learning Goal</h2>
        <form onSubmit={handleSubmit}>
          <label>Goal Title:</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
          <label>Target Date:</label>
          <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required />
          <button type="submit" style={{ marginTop: 10 }}>Save Goal</button>
        </form>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}

export default SetGoal;