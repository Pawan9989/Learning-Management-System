import React, { useState } from "react";

function UserProfile({ user }) {
  const [bio, setBio] = useState(user.bio || "");
  const [interests, setInterests] = useState(user.interests || "");

  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
      padding: 24,
      marginBottom: 24
    }}>
      <h2 style={{ color: "#2563eb" }}>{user.name}'s Profile</h2>
      <div>
        <label>Bio:</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          style={{ width: "100%", minHeight: 60, marginBottom: 12 }}
        />
      </div>
      <div>
        <label>Interests:</label>
        <input
          value={interests}
          onChange={e => setInterests(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />
      </div>
      <button style={{
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 18px",
        fontWeight: 600,
        fontSize: "1rem",
        cursor: "pointer"
      }}>
        Save Profile
      </button>
    </div>
  );
}

export default UserProfile;