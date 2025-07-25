import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const CAREER_PATHS = [
  "Software Engineer",
  "Data Scientist",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "AI/ML Engineer",
  "Cybersecurity Specialist",
  "Cloud Architect"
];

function CareerPaths() {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  const handleSelect = (path) => {
    setSelected(path);
    navigate(`/career-paths/${encodeURIComponent(path)}`);
  };

  return (
    <div>
      <Navbar page="career-paths" />
      <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #2563eb22", padding: 32 }}>
        <h2 style={{ color: "#2563eb", marginBottom: 24 }}>Explore Career Paths</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {CAREER_PATHS.map((path) => (
            <li key={path} style={{ marginBottom: 18 }}>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 8,
                  border: "1.5px solid #2563eb",
                  background: selected === path ? "#2563eb" : "#f7faff",
                  color: selected === path ? "#fff" : "#2563eb",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onClick={() => handleSelect(path)}
              >
                {path}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CareerPaths;