import React, { useState } from "react";
import CameraFeed from "./components/CameraFeed";
import WireframeCanvas from "./components/WireframeCanvas";
import TextInput from "./components/TextInput";
import AudioInput from "./components/AudioInput";
import FinalEmotion from "./components/FinalEmotion";

function App() {
  const [face, setFace] = useState("");
  const [text, setText] = useState("");
  const [audio, setAudio] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #0F172A 0%, #1e293b 50%, #334155 100%)", 
      color: "white", 
      minHeight: "100vh", 
      padding: "10px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      
      <style>
        {`
          @media (max-width: 768px) {
            .app-title { font-size: 1.5rem !important; }
            .btn { padding: 10px 20px !important; font-size: 14px !important; }
            .card { width: 100% !important; max-width: none !important; }
          }
          @media (min-width: 769px) {
            .card { flex: 1 1 300px; max-width: 45%; }
          }
          .btn:hover { transform: scale(1.05); }
          .card:hover { transform: translateY(-5px); }
        `}
      </style>

      <h1 className="app-title" style={{ textAlign: "center", marginBottom: "20px", fontSize: "2rem" }}>
        🎭 Real Time Emotion Detection Systems
      </h1>

      {/* START / STOP BUTTON */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setIsRunning(true)}
          className="btn"
          style={btnStyle("#22c55e")}
        >
          ▶ Start
        </button>

        <button
          onClick={() => setIsRunning(false)}
          className="btn"
          style={btnStyle("#ef4444")}
        >
          ⏹ Stop
        </button>
      </div>

      {/* CAMERA + WIREFRAME */}
      <div style={rowStyle}>
        <Card title="🎥 Live Camera">
          <CameraFeed setEmotion={setFace} isRunning={isRunning} />
        </Card>

        <Card title="🧊 Face Wireframe">
          {isRunning && <WireframeCanvas />}
        </Card>
      </div>

      {/* TEXT + AUDIO */}
      <div style={rowStyle}>
        <Card title="💬 Text Emotion">
          <TextInput setEmotion={setText} />
        </Card>

        <Card title="🎙 Audio Emotion">
          <AudioInput setEmotion={setAudio} />
        </Card>
      </div>

      {/* FINAL EMOTION */}
      <Card title="🧠 Final Emotion">
        <FinalEmotion face={face} text={text} audio={audio} />
      </Card>
    </div>
  );
}

export default App;

/* ---------- STYLES ---------- */

const rowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const btnStyle = (color) => ({
  background: `linear-gradient(45deg, ${color}, ${color}dd)`,
  color: "white",
  border: "none",
  padding: "12px 25px",
  margin: "10px",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.3s ease",
  boxShadow: `0 4px 15px ${color}50`,
  fontWeight: "bold"
});

/* CARD COMPONENT */
function Card({ title, children }) {
  return (
    <div
      className="card"
      style={{
        background: "rgba(255,255,255,0.08)",
        padding: "20px",
        borderRadius: "15px",
        backdropFilter: "blur(15px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.3s ease",
        flex: "1 1 300px",
        maxWidth: "45%"
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "15px", fontSize: "1.2rem" }}>{title}</h3>
      {children}
    </div>
  );
}