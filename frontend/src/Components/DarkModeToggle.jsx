import React from "react";

function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        background: darkMode ? "#222" : "#fff",
        color: darkMode ? "#fff" : "#222",
        border: "1px solid #2563eb",
        borderRadius: 6,
        padding: "6px 16px",
        cursor: "pointer",
        marginBottom: 18
      }}
    >
      {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
}

export default DarkModeToggle;