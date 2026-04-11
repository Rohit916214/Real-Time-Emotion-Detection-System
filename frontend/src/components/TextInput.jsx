import React, { useState } from "react";

export default function TextInput({ setEmotion }) {
  const [text, setText] = useState("");
  const [emotion, setLocalEmotion] = useState("");

  async function handleSubmit() {
    const res = await fetch(
      "http://127.0.0.1:8000/text-emotion?text=" + text,
      { method: "POST" }
    );

    const data = await res.json();
    setEmotion(data.emotion);
    setLocalEmotion(data.emotion);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        style={{
          padding: "10px",
          width: "80%",
          borderRadius: "8px",
          border: "none"
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "10px",
          padding: "8px 15px",
          borderRadius: "8px",
          background: "#3b82f6",
          color: "white",
          border: "none"
        }}
      >
        Analyze
      </button>

      <h3 style={{ marginTop: "10px" }}>
        {emotion && `Emotion: ${emotion}`}
      </h3>
    </div>
  );
}