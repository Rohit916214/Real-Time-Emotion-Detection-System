import React, { useState } from "react";

export default function AudioInput({ setEmotion }) {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [emotion, setLocalEmotion] = useState("");

  let recognition;

  function startListening() {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const speechText = event.results[0][0].transcript;
      setText(speechText);

      // 👉 send to backend (same as text)
      const res = await fetch(
        "http://127.0.0.1:8000/text-emotion?text=" + speechText,
        { method: "POST" }
      );

      const data = await res.json();

      setEmotion(data.emotion);
      setLocalEmotion(data.emotion);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={startListening}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          background: "#3b82f6",
          color: "white",
          border: "none"
        }}
      >
        🎤 {listening ? "Listening..." : "Start Speaking"}
      </button>

      <p>{text}</p>

      <h3>{emotion}</h3>
    </div>
  );
}
