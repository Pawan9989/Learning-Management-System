import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import GeminiChatbot from "./GeminiChatbot";
import CourseRecommendations from "./CourseRecommendations";

function getMotivation() {
  const messages = [
    "Keep going, you're doing great!",
    "Every day is a new opportunity to learn.",
    "Small steps every day lead to big results.",
    "Believe in yourself and all that you are.",
    "Stay curious. Stay motivated!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function PersonalDashboard() {
  const [progress, setProgress] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [motivation, setMotivation] = useState(getMotivation());
  const [goals, setGoals] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  useEffect(() => {
    // Fetch enrolled courses and progress
    fetch(`http://localhost:8085/api/learning/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProgress(Array.isArray(data) ? data : []);
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setProgress([]);
        setCourses([]);
      });

    // Fetch deadlines
    fetch(`http://localhost:8085/api/deadlines/${userId}`)
      .then((res) => res.json())
      .then((data) => setDeadlines(Array.isArray(data) ? data : []))
      .catch(() => setDeadlines([]));

    // Fetch goals
    fetch(`http://localhost:8085/api/goals/${userId}`)
      .then((res) => res.json())
      .then((data) => setGoals(Array.isArray(data) ? data : []))
      .catch(() => setGoals([]));

    // Fetch user details for interests
    fetch(`http://localhost:8085/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser({}));
  }, [userId]);

  // Helper to get course name by courseId
  const getCourseName = (courseId) => {
    const course = courses.find(
      (c) => String(c.id || c.course_id) === String(courseId)
    );
    return course ? (course.courseName || course.course_name) : `Course ID: ${courseId}`;
  };

  return (
    <div style={{ background: "#f4f6fb", minHeight: "100vh" }}>
      <Navbar page="dashboard" />
      <div className="container" style={{
        marginTop: 36,
        maxWidth: 700,
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 4px 16px rgba(37,99,235,0.08)",
        padding: "32px 32px 24px 32px"
      }}>
        {/* Welcome */}
        <div style={{
          marginBottom: 18,
          fontSize: 26,
          color: "#2563eb",
          fontWeight: 700
        }}>
          Welcome back, {localStorage.getItem("name")}
        </div>
        
        {/* Motivation */}
        <div style={{
          marginBottom: 24,
          fontSize: 18,
          color: "#234099",
          background: "#eaf1ff",
          borderRadius: 7,
          padding: "12px 20px",
          fontWeight: 500
        }}>
          {motivation}
        </div>
        <CourseRecommendations useGemini={true} />
        {/* Progress */}
        <div style={{
          marginBottom: 32,
          padding: "18px 20px",
          background: "#f7faff",
          borderRadius: 7,
          boxShadow: "0 1px 4px rgba(37,99,235,0.04)"
        }}>
          <h3 style={{ color: "#2563eb", marginBottom: 10, fontWeight: 600, fontSize: 20 }}>Your Progress</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {progress.length === 0 && <li style={{ color: "#888" }}>No enrolled courses yet.</li>}
            {progress.map((course) => (
              <li key={course.id || course.course_id} style={{ marginBottom: 7, fontSize: 15 }}>
                <b>{course.courseName || course.course_name}</b>
              </li>
            ))}
          </ul>
        </div>
        {/* Deadlines */}
        <div style={{
          marginBottom: 32,
          padding: "18px 20px",
          background: "#fff8f2",
          borderRadius: 7,
          boxShadow: "0 1px 4px rgba(230,126,34,0.04)"
        }}>
          <h3 style={{ color: "#e67e22", marginBottom: 10, fontWeight: 600, fontSize: 20 }}>Upcoming Deadlines</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {deadlines.length === 0 && <li style={{ color: "#888" }}>No upcoming deadlines.</li>}
            {deadlines.map((d, i) => (
              <li key={i} style={{ marginBottom: 7, fontSize: 15 }}>
                <b>{d.course}</b>: {d.task} due on <span style={{ color: "crimson" }}>{d.due}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Goals */}
        <div style={{
          marginBottom: 24,
          padding: "18px 20px",
          background: "#f6fff7",
          borderRadius: 7,
          boxShadow: "0 1px 4px rgba(33,167,0,0.04)"
        }}>
          <h3 style={{ color: "#21a700", marginBottom: 10, fontWeight: 600, fontSize: 20 }}>Your Goals</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {(!Array.isArray(goals) || goals.length === 0) && <li style={{ color: "#888" }}>No goals set yet.</li>}
            {Array.isArray(goals) && goals.map((g, i) => (
              <li key={i} style={{ marginBottom: 12, fontSize: 16 }}>
                <div style={{ fontWeight: 600, color: "#2563eb", marginBottom: 2 }}>
                  {getCourseName(g.courseId)}
                </div>
                <div style={{ color: "#222", marginBottom: 2 }}>
                  {g.title}
                </div>
                <div style={{ color: "#21a700" }}>
                  <span style={{ fontWeight: 500 }}>Target:</span> {g.targetDate}
                </div>
              </li>
            ))}
          </ul>
          <button
            style={{
              marginTop: 18,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 2px 8px rgba(37,99,235,0.07)",
              cursor: "pointer"
            }}
            onClick={() => navigate("/set-goal")}
          >
            Set a New Goal
          </button>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}>
        <GeminiChatbot />
      </div>
    </div>
  );
}

export default PersonalDashboard;