import React from "react";

function StreakCounter({ streak }) {
  return (
    <div style={{
      background: "#eafbe7",
      color: "#21a700",
      borderRadius: 7,
      padding: "8px 16px",
      fontWeight: 600,
      fontSize: "1rem",
      marginBottom: 14,
      display: "inline-block"
    }}>
      🔥 Learning Streak: {streak} day{streak !== 1 ? "s" : ""}
    </div>
  );
}

export default StreakCounter;