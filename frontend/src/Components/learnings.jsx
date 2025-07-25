import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import StreakCounter from "./StreakCounter";

function Learnings() {
  const userId = localStorage.getItem("id");
  const [courses, setCourse] = useState([]);
  const [goals, setGoals] = useState([]);
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(`http://localhost:8085/api/learning/${userId}`);
        setCourse(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourse();

    // Fetch user goals
    fetch(`http://localhost:8085/api/goals/${userId}`)
      .then((res) => res.json())
      .then((data) => setGoals(Array.isArray(data) ? data : []))
      .catch(() => setGoals([]));

    // Fetch user streak
    fetch(`http://localhost:8085/api/users/${userId}/streak`)
      .then(res => res.json())
      .then(data => setStreak(data))
      .catch(() => setStreak(0));
  }, [userId]);

  // Helper to check if a goal exists for a course
  const hasGoal = (courseId) => Array.isArray(goals) && goals.some(g => String(g.courseId) === String(courseId));

  // Handler for Start Learning button
  const handleStartLearning = async (courseId) => {
    // Update streak before navigating
    await fetch(`http://localhost:8085/api/users/${userId}/streak`, { method: "POST" });
    // Optionally, refresh streak in UI
    fetch(`http://localhost:8085/api/users/${userId}/streak`)
      .then(res => res.json())
      .then(data => setStreak(data))
      .catch(() => setStreak(0));
    navigate(`/course/${courseId}`);
  };

  if (courses.length === 0) {
    return (
      <>
        <Navbar page="learnings" />
        <div style={{ textAlign: 'center', marginTop: '10%' }}>
          <h1 style={{ fontSize: '30px', marginBottom: '20px' }}>
            You have not enrolled in any courses yet...!!!
          </h1>
          <p style={{ color: '#666', fontSize: '18px' }}>
            Explore our courses and start your learning journey.
          </p>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#017bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
            onClick={() => navigate('/courses')}
          >
            Explore Courses
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar page={"learnings"} />
      <div style={{ margin: "20px 0 0 20px" }}>
        <StreakCounter streak={streak} />
      </div>
      <div className="learn-courses-container" style={{ marginTop: "20px" }}>
        {courses.map((course) => (
          <div key={course.id} className="learn-course-card">
            <img src={course.photo} alt={course.courseName} className="learn-course-image" />
            <div className="course-details">
              <h3 className="course-heading">
                {course.courseName.length < 8
                  ? `${course.courseName} Tutorial`
                  : course.courseName
                }
              </h3>
              <p className="course-description">by {course.instructor}</p>
            </div>
            {/* Actions: Start Learning, Set Goal, View Dashboard */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginTop: "10px"
            }}>
              <button
                style={{
                  width: "100%",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "4px 0",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
                onClick={() => handleStartLearning(course.id)}
              >
                Start Learning
              </button>
              {hasGoal(course.id) ? (
                <div
                  style={{
                    width: "100%",
                    background: "#eafbe7",
                    color: "#21a700",
                    borderRadius: "5px",
                    padding: "4px 0",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textAlign: "center"
                  }}
                >
                  Goal Set
                </div>
              ) : (
                <button
                  style={{
                    width: "100%",
                    background: "#21a700",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "4px 0",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate("/set-goal", { state: { courseId: course.id } })}
                >
                  Set Goal for this Course
                </button>
              )}
              <button
                style={{
                  width: "100%",
                  background: "#ffd600",
                  color: "#222",
                  border: "none",
                  borderRadius: "5px",
                  padding: "4px 0",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
                onClick={() => navigate("/my-dashboard")}
              >
                View My Dashboard
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Learnings;