

/*
import React, { useEffect, useRef, useState } from "react";

export default function CameraFeed({ setEmotion }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [localEmotion, setLocalEmotion] = useState("Detecting...");

  useEffect(() => {
    startCamera();
    startSendingFrames();
  }, []);


  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = stream;
  }

  function captureFrame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  }

  async function sendFrame() {
    const blob = await captureFrame();

    const formData = new FormData();
    formData.append("file", blob);

    try {
      const res = await fetch("http://127.0.0.1:8000/face-emotion", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setLocalEmotion(data.emotion);  // UI ke liye
      setEmotion(data.emotion);       // 🔥 parent ko bhejna (IMPORTANT)

    } catch (err) {
      console.error(err);
    }
  }

  function startSendingFrames() {
    setInterval(sendFrame, 1000);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>🎥 Live Camera</h2>

      <video ref={videoRef} autoPlay width="400" />

      <canvas ref={canvasRef} width="400" height="300" style={{ display: "none" }} />

      <h3>Emotion: {localEmotion}</h3>
    </div>
  );
}

*/





import React, { useEffect, useRef, useState } from "react";

export default function CameraFeed({ setEmotion, isRunning }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [localEmotion, setLocalEmotion] = useState("Detecting...");

  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  // 🎥 Start Camera
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  }

  // 🛑 Stop Camera
  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Reload to fully release
    }
  }

  // 📸 Capture Frame
  function captureFrame() {
    if (!canvasRef.current || !videoRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  }

  // 📡 Send Frame to Backend
  async function sendFrame() {
    if (!isRunning) return;

    const blob = await captureFrame();
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob);

    try {
      const res = await fetch("http://127.0.0.1:8000/face-emotion", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setLocalEmotion(data.emotion);
      setEmotion(data.emotion);
    } catch (err) {
      console.error("API error:", err);
    }
  }

  // 🔄 Control Start/Stop
  useEffect(() => {
    if (isRunning) {
      startCamera();

      intervalRef.current = setInterval(() => {
        sendFrame();
      }, 1000);
    } else {
      // 🔥 STOP everything
      clearInterval(intervalRef.current);
      stopCamera();
    }

    // 🔥 Cleanup on unmount
    return () => {
      clearInterval(intervalRef.current);
      stopCamera();
    };
  }, [isRunning]);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        width="400"
        style={{ borderRadius: "10px" }}
      />

      <canvas
        ref={canvasRef}
        width="400"
        height="300"
        style={{ display: "none" }}
      />

      <h3>Emotion: {localEmotion}</h3>
    </div>
  );
}