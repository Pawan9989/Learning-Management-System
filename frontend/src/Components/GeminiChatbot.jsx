import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
// Use online Gemini Bard logo
const geminiLogo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNgxyIQLENmHj0d9kisFxyiFP4Dan0d3Oaxg&s";

const GEMINI_API_KEY = "";

// ...rest of your code remains unchanged...

const GeminiChatbot = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm Gemini. How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const userMsg = { from: "user", text: prompt };
    setMessages((msgs) => [...msgs, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMsg.text }] }],
          }),
        }
      );
      const data = await response.json();
      let botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";
      setMessages((msgs) => [...msgs, { from: "bot", text: botText }]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, there was an error." },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Bot Icon */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 9999,
        }}
      >
        {!open && (
          <button
            aria-label="Open Gemini Chatbot"
            onClick={() => setOpen(true)}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 64,
              height: 64,
              boxShadow: "0 4px 24px rgba(44,62,80,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
              padding: 0,
            }}
          >
            <img
              src={geminiLogo}
              alt="Gemini Bot"
              style={{ width: 44, height: 44, borderRadius: "50%" }}
            />
          </button>
        )}

        {/* Chat Window */}
        {open && (
          <div
            style={{
              width: 340,
              height: 440,
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 8px 32px rgba(44,62,80,0.22)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "fadeInUp 0.3s",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#fff",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center" }}>
                <img
                  src={geminiLogo}
                  alt="Gemini"
                  style={{ width: 28, height: 28, borderRadius: "50%", marginRight: 8, background: "#fff" }}
                />
                Gemini Chatbot
              </span>
              <FaTimes
                style={{ cursor: "pointer" }}
                onClick={() => setOpen(false)}
                size={22}
              />
            </div>
            {/* Messages */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                overflowY: "auto",
                background: "#f6f8fa",
                fontSize: 15,
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.from === "user" ? "flex-end" : "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      background:
                        msg.from === "user"
                          ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                          : "#e5e7eb",
                      color: msg.from === "user" ? "#fff" : "#222",
                      borderRadius: 14,
                      padding: "8px 14px",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <form
              onSubmit={handleSend}
              style={{
                display: "flex",
                borderTop: "1px solid #e5e7eb",
                background: "#fff",
                padding: 10,
              }}
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Gemini anything..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 15,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "#f4f7fb",
                  marginRight: 8,
                }}
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "..." : "Send"}
              </button>
            </form>
          </div>
        )}
      </div>
      {/* Floating animation keyframes */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </>
  );
};

export default GeminiChatbot;