
    // import React from "react";

    // export default function FinalEmotion({ face, text, audio }) {

    // function getFinalEmotion() {

    //     // 🥇 Priority 1: Face emotion
    //     if (face && face !== "Detecting...") {
    //     return face;
    //     }

    //     // 🥈 Priority 2: Majority voting
    //     const emotions = [face, text, audio].filter(
    //     (e) => e && e !== "Detecting..."
    //     );

    //     if (emotions.length === 0) return "No Emotion";

    //     const count = {};
    //     emotions.forEach((e) => {
    //     count[e] = (count[e] || 0) + 1;
    //     });

    //     let final = emotions[0];
    //     for (let key in count) {
    //     if (count[key] > count[final]) {
    //         final = key;
    //     }
    //     }

    //     return final;
    // }

    // return (
    //     <div style={{ textAlign: "center" }}>
    //     <h1 style={{ color: "#22c55e", fontSize: "40px" }}>
    //         {getFinalEmotion()}
    //     </h1>


    //  {/* DEBUG VIEW (optional but powerful) */}
        
    //     <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.7 }}>
    //         <p>Face: {face}</p>
    //         <p>Text: {text}</p>
    //         <p>Audio: {audio}</p>
    //     </div>
    //     </div>
    // );
    // }

//---------------------------------------




import React from "react";

export default function FinalEmotion({ face, text, audio }) {

  const emojiMap = {
    happy: "😄",
    joy: "😄",
    sadness: "😢",
    sad: "😢",
    angry: "😡",
    fear: "😨",
    neutral: "😐"
  };

  const colorMap = {
    happy: "#22c55e",
    joy: "#22c55e",
    sadness: "#3b82f6",
    sad: "#3b82f6",
    angry: "#ef4444",
    fear: "#a855f7",
    neutral: "#eab308"
  };

    function getFinalEmotion() {

    const emotions = [face, text, audio].filter(
        (e) => e && e !== "Detecting..."
    );

    if (emotions.length === 0) return "No Emotion";

    // 🧠 Count frequency
    const count = {};
    emotions.forEach((e) => {
        count[e] = (count[e] || 0) + 1;
    });

    let majority = emotions[0];
    for (let key in count) {
        if (count[key] > count[majority]) {
        majority = key;
        }
    }

    // 🥇 Smart Rule
    if (face && face !== "neutral") {
        return face;
    }

    // 🥈 fallback to majority
    return majority;
    }

  const final = getFinalEmotion().toLowerCase();
  const color = colorMap[final] || "#22c55e";
  const emoji = emojiMap[final] || "🙂";

  return (
    <div style={{
      textAlign: "center",
      padding: "20px",
      borderRadius: "15px",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(10px)",
      boxShadow: `0 0 25px ${color}`
    }}>

      <h1 style={{
        fontSize: "50px",
        color: color,
        transition: "all 0.5s ease",
        textShadow: `0 0 20px ${color}`,
        animation: "pulse 1.5s infinite"
      }}>
        {emoji} {final}
      </h1>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      <div style={{ marginTop: "10px", opacity: 0.7 }}>
        <p>Face: {face || "None"}</p>
        <p>Text: {text || "None"}</p>
        <p>Audio: {audio || "None"}</p>
      </div>
    </div>
  );
}