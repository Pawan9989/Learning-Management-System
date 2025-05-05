import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Forum from "./forum";
import ReactPlayer from "react-player";
import { Progress } from "antd";
import { Button, Modal } from "antd";
import Feedback from "./Feedback";
import ReactMarkdown from "react-markdown";
import Assessment from "./Assessment"; // Import the Assessment component

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const [course, setCourse] = useState({
    course_name: "",
    instructor: "",
    price: null,
    description: "",
    y_link: "",
    p_link: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(null);
  const [played, setPlayed] = useState(0);
  const [changePlayed, setChangePlayed] = useState(0);
  const [userId] = useState(localStorage.getItem("id"));
  const [popup, setPopup] = useState(false);

  // Gemini Chatbot states
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [geminiLoading, setGeminiLoading] = useState(false);

  const handleGeminiPromptChange = (e) => setGeminiPrompt(e.target.value);

  const handleGeminiPromptSubmit = async (e) => {
    e.preventDefault();
    setGeminiLoading(true);
    setGeminiResponse(""); 
    try {
      // Use the free model: gemini-1.0
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
          }),
        }
      );
      const data = await response.json();
      // Improved: handle more Gemini response cases
      if (data.candidates && data.candidates.length > 0) {
        const text =
          data.candidates[0].content?.parts?.[0]?.text ||
          data.candidates[0].content?.parts?.[0]?.data ||
          data.candidates[0].content?.text ||
          "No response from Gemini.";
        setGeminiResponse(text.trim());
      } else if (data.promptFeedback && data.promptFeedback.blockReason) {
        setGeminiResponse(
          "Gemini could not answer this prompt due to content restrictions."
        );
      } else if (data.error && data.error.message) {
        setGeminiResponse("Error: " + data.error.message);
      } else {
        setGeminiResponse("No response from Gemini.");
      }
    } catch (err) {
      setGeminiResponse("Sorry, there was an error fetching the response.");
    }
    setGeminiLoading(false);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/courses/${courseId}`
        );
        const fetchedCourse = response.data;
        setCourse(fetchedCourse);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  const handleDuration = () => {
    setDuration(playerRef.current.getDuration());
    if (duration != 0) {
      fetch("http://localhost:8085/api/progress/update-duration", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          courseId,
          duration,
        }),
      });
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8085/api/progress/${userId}/${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        setPlayed(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userId, courseId]);

  useEffect(() => {
    const updateProgress = async () => {
      if (courseId && userId) {
        try {
          const response = await fetch(
            "http://localhost:8085/api/progress/update-progress",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                courseId,
                playedTime: played,
                duration,
              }),
            }
          );

          if (response.ok) {
            setPlayed(changePlayed < played ? played : changePlayed);
          } else {
            console.error("Error updating progress:", response.statusText);
          }
        } catch (error) {
          console.error("Error updating progress:", error);
        }
      }
    };

    updateProgress();
  }, [changePlayed, courseId, userId, played, duration]);

  // Add state for showing quiz
  const [showQuiz, setShowQuiz] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong!</div>;
  }
  return (
    <div>
      {/* Back Button at Top-Left */}
      <button
        className="enroll-button"
        style={{
          position: "absolute",
          top: -6.5,
          left: 0,
          zIndex: 10,
          padding: "10px 28px",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer"
        }}
        onClick={() => navigate("/learnings")}
      >
        Back
      </button>
      <h3
        style={{
          textAlign: "center",
          color: "white",
          padding: "10px",
          fontSize: "900",
          fontStyle: "italic",
          backgroundColor: "darkblue",
          width: "100%",
          height: "-19px",
        }}
      >
        The Complete {course.course_name} Course - 2023
      </h3>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div key={courseId} className="course">
          <div style={{ display: "flex", gap: "20px" }}>
            <ReactPlayer
              ref={playerRef}
              onProgress={(Progress) => {
                if (changePlayed + 10 <= Progress.playedSeconds) {
                  setChangePlayed(Progress.playedSeconds);
                }
              }}
              url={course.y_link}
              controls
              type="video/mp4"
              width="65%"
              height="440px"
              onDuration={handleDuration}
              played={played}
              style={{
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.52)",
                padding: "8px",
                backgroundColor: "darkgrey",
                borderRadius: "10px",
              }}
            />
            <div
              style={{
                width: "45%", // Match video width
                height: "440px", // Match video height
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.52)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                background: "#f4f7fb",
                padding: "24px",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>
                Ask Gemini AI about this course:
              </h4>
              <form
                onSubmit={handleGeminiPromptSubmit}
                style={{ display: "flex", gap: "10px" }}
              >
                <input
                  type="text"
                  value={geminiPrompt}
                  onChange={handleGeminiPromptChange}
                  placeholder="Type your question..."
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1.5px solid #e0e6ed",
                    fontSize: "1rem",
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  disabled={geminiLoading}
                >
                  {geminiLoading ? "Thinking..." : "Ask"}
                </button>
              </form>
              {geminiResponse && (
                <div
                  style={{
                    marginTop: "18px",
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "14px",
                    boxShadow: "0 1px 4px rgba(44,62,80,0.04)",
                    color: "#232946",
                    flex: 1,
                    overflowY: "auto",
                    minHeight: 0,
                    textAlign: "left",
                  }}
                >
                  <strong>Gemini:</strong>
                  <ReactMarkdown>{geminiResponse}</ReactMarkdown>
                </div>
              )}
              {/* Quiz Section Below Gemini Chatbot */}
              <h4 style={{ marginTop: "20px" }}>
                Evaluate Yourself:
              </h4>
              {/* <p>
                The assessments are designed to reinforce your learning and
                provide valuable feedback on your progress throughout the
                course.
              </p> */}
              <p>
                Click the below <b>"Take Quiz"</b> button to take the
                assessment
              </p>
              {Math.ceil((played / duration) * 100) >= 98 && (
                <button
                  className="enroll-button"
                  onClick={() => navigate(`/assessment/${course.course_id}`)}
                >
                  Take Quiz
                </button>
              )}
              {Math.ceil((played / duration) * 100) < 98 && (
                <button className="enroll-button-deactive" onClick={showModal}>
                  Take Quiz
                </button>
              )}
            </div>
          </div>

          {/* Modernized Description Card with All Course Info */}
          <div style={{
            background: '#fff',
            borderRadius: '14px',
            boxShadow: '0 2px 12px rgba(44,62,80,0.10)',
            padding: '24px 28px',
            margin: '32px auto 0 auto',
            maxWidth: 700,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 18,
            textAlign: 'left', // Ensure the whole card content is left-aligned
            direction: 'ltr' // Ensure left-to-right layout
          }}>
            <span style={{ fontSize: 28, color: '#2563eb', marginRight: 8, marginTop: 2 }}>
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v7h-2z" fill="#2563eb"/></svg>
            </span>
            <div style={{width: '100%'}}>
              <h4 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#232946', letterSpacing: 0.2, textAlign: 'left' }}>Description</h4>
              <p style={{ margin: '10px 0 18px 0', color: '#555', fontSize: 16, lineHeight: 1.7, fontWeight: 500, textAlign: 'left' }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 32px', fontSize: 15, color: '#333', fontWeight: 500, textAlign: 'left' }}>
                <div><b>Course Name:</b> {course.course_name}</div>
                <div><b>Instructor:</b> {course.instructor}</div>
                <div><b>Content type:</b> Video</div>
                {/* {course.price && <div><b>Price:</b> ₹{course.price}</div>} */}
              </div>
              <div style={{ marginTop: 18, color: '#666', fontSize: 15, textAlign: 'left' }}>
                This online programming course provides a comprehensive introduction to the <b>{course.course_name}</b>. Whether you're a beginner or looking to expand your coding skills, this course will cover <b>{course.course_name}</b> fundamentals and prepare you for more advanced challenges.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pro-report">
        <div className="progress-report-section">
          <div className="progress-section">
            <h3 className="section-title">Progress:</h3>
            <Progress
              percent={Math.ceil((played / duration) * 100)}
              status="active"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              showInfo={false}
            />
          </div>
          <div className="report-section">
            <h3 className="section-title">Report:</h3>
            <p className="completion-text">
              You have completed{" "}
              <span className="completion-percent">
                {Math.ceil((played / duration) * 100)}%
              </span>{" "}
              of this course.
            </p>
          </div>
        </div>
      </div>
      <button
        className="enroll-button"
        onClick={() => navigate(`/discussion/${courseId}`)}
      >
        discussion
      </button>
      <Feedback courseid={courseId} />
    </div>
  );
};

export default Course;