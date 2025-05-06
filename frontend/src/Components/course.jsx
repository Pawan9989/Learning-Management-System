import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { Progress, Button, Modal } from "antd";
import ReactMarkdown from "react-markdown";
import Feedback from "./Feedback";

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
      if (data.candidates && data.candidates.length > 0) {
        const text =
          data.candidates[0].content?.parts?.[0]?.text ||
          "No response from Gemini.";
        setGeminiResponse(text.trim());
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
    if (duration !== 0) {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong!</div>;
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: -6.7,
          left: 2,
          padding: "10px 15px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
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
        {/* Video Section */}
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
          width="100%"
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
        {/* Progress Section */}
      <div style={{ marginTop: "30px" }}>
        <h4>Course Progress</h4>
        <Progress
          percent={((played / duration) * 100).toFixed(2)}
          status="active"
        />
      </div>

        {/* Description and Chatbot Section */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            justifyContent: "space-between",
          }}
        >
          {/* Description Section */}
          <div
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: "14px",
              boxShadow: "0 2px 12px rgba(44,62,80,0.10)",
              padding: "24px 28px",
              textAlign: "left",
            }}
          >
            <h4 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              Description
            </h4>
            <p style={{ margin: "10px 0 18px 0", color: "#555" }}>
              {course.description}
            </p>
            <div>
              <b>Course Name:</b> {course.course_name}
            </div>
            <div>
              <b>Instructor:</b> {course.instructor}
            </div>
          </div>

          {/* Chatbot Section */}
          <div
            style={{
              flex: 1,
              background: "#f4f7fb",
              borderRadius: "14px",
              boxShadow: "0 2px 12px rgba(44,62,80,0.10)",
              padding: "24px",
            }}
          >
            <h4>Ask Gemini AI about this course:</h4>
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
                }}
              >
                <strong>Gemini:</strong>
                <ReactMarkdown>{geminiResponse}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>

      <h4>Evaluate Yourself:</h4>
              <p>
                The assessments are designed to reinforce your learning and
                provide valuable feedback on your progress throughout the
                course.
              </p>
              <p>
                Click the below <b>"Take Quizz"</b> button to take the
                assessment
              </p>{" "}
            
          {Math.ceil((played / duration) * 100) >= 98 && (
              <button
                className="enroll-button"
                onClick={() => navigate(`/assessment/${course.course_id}`)}
              >
                {" "}
                Quizz
              </button>
            )}
            {Math.ceil((played / duration) * 100) < 98 && (
              <button
                className="enroll-button-deactive"
                onClick={showModal}
              >
                Quizz
              </button>
            )}

      {/* Feedback Section */}
      <div style={{ marginTop: "30px" }}>
        <h4>Feedback</h4>
        <Feedback courseId={courseId} />
      </div>
    </div>
  );
};

export default Course;