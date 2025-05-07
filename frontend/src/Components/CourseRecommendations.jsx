import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Helper to fetch enrolled courses for a user
async function fetchEnrolledCourses(userId) {
  if (!userId) return [];
  try {
    const res = await fetch(`http://localhost:8085/api/learning/${userId}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function CourseRecommendations({ interests, useGemini = false }) {
  const [recommendations, setRecommendations] = useState([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    // If using Gemini for recommendations
    if (useGemini) {
      (async () => {
        const enrolledCourses = await fetchEnrolledCourses(userId);
        const enrolledNames = enrolledCourses.map(
          (c) => c.courseName || c.course_name
        );
        let prompt = "";
        if (enrolledNames.length > 0) {
          prompt = `Based on these enrolled courses: ${enrolledNames.join(", ")}, recommend 3 more relevant courses from our catalog. Respond with only the course names.`;
        } else {
          prompt = "Recommend 3 popular or trending courses from our catalog. Respond with only the course names.";
        }
        // Call Gemini API
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyDmTCOqGMk6lXa_RHcVN2OYOdrRNsRv3ag`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
        );
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        // Split by line or comma
        const recs = text
          .split(/\n|,/)
          .map((s) => s.trim())
          .filter(Boolean);
        setRecommendations(recs);
      })();
    } else {
      // Default: Use backend recommend endpoint (by interests)
      if (!interests) return;
      fetch(
        `http://localhost:8085/api/courses/recommend?interests=${encodeURIComponent(
          interests
        )}`
      )
        .then((res) => res.json())
        .then((data) => setRecommendations(Array.isArray(data) ? data : []));
    }
  }, [interests, useGemini, userId]);

  if (!recommendations.length) return null;

  return (
    <div
      style={{
        background: "#f7faff",
        borderRadius: 7,
        padding: "14px 18px",
        marginBottom: 24,
      }}
    >
      <h4 style={{ color: "#2563eb", marginBottom: 8 }}>
        Recommended for you
      </h4>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {recommendations.map((course, idx) =>
          typeof course === "string" ? (
            <li key={idx}>{course}</li>
          ) : (
            <li key={course.id || course.course_id}>
              <Link to={`/course/${course.id || course.course_id}`}>
                {course.courseName || course.course_name}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default CourseRecommendations;