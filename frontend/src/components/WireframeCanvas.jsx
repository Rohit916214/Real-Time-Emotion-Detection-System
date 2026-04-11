import React, { useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default function WireframeCanvas() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext("2d");

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      ctx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawWireframe(ctx, landmarks, canvasElement);
        }
      }
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await faceMesh.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, []);

  function drawWireframe(ctx, landmarks, canvas) {
    ctx.fillStyle = "#00ffcc";

    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i].x * canvas.width;
      const y = landmarks[i].y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <video ref={videoRef} style={{ display: "none" }} />

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          border: "2px solid cyan",
          borderRadius: "10px",
        }}
      />
    </div>
  );
}