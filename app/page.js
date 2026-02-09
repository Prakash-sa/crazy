"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import Three3D from "./Three3D";

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [noClicks, setNoClicks] = useState(0);
  const [mailStatus, setMailStatus] = useState("idle");

  const floatingLights = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: (i * 13) % 100,
        y: (i * 19) % 100,
        delay: (i % 6) * 0.35,
        scale: 0.6 + (i % 4) * 0.25
      })),
    []
  );
  const celebrationBits = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: (i * 7.2) % 100,
        delay: (i % 10) * 0.1,
        duration: 2.5 + (i % 5) * 0.3,
        rotate: (i * 41) % 360
      })),
    []
  );

  const noButtonText = [
    "No.",
    "Sorry — it won't happen again.",
    "Not even for momos?",
    "Are you sure?",
    "Not even for pani puri?",
    "Think again…",
    "Please?",
    "The owls are waiting 🦉",
    "Still no?"
  ];

  useEffect(() => {
    const handleMove = (event) => {
      const x = (event.clientY / window.innerHeight - 0.5) * -12;
      const y = (event.clientX / window.innerWidth - 0.5) * 12;
      setRotation({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const noButtonLabel = noButtonText[Math.min(noClicks, noButtonText.length - 1)];
  const noProgress = Math.min(noClicks / 8, 1);
  const yesButtonScale = 1 + Math.min(noClicks, 10) * 0.15;
  const yesButtonPadding = 0.75 + Math.min(noClicks, 10) * 0.08;
  const yesButtonOpacity = 0.75 + noProgress * 0.25;
  const noButtonOpacity = 1 - noProgress;
  const noButtonScale = 1 - noProgress * 0.55;

  const handleYesClick = async () => {
    setAccepted(true);
    setMailStatus("sending");

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Additional confetti bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.2, y: 0.5 }
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.8, y: 0.5 }
      });
    }, 400);

    try {
      const res = await fetch("/api/send-valentine", { method: "POST" });
      if (!res.ok) {
        throw new Error("Mail request failed");
      }
      setMailStatus("sent");
    } catch {
      setMailStatus("error");
    }
  };

  return (
    <main className="scene">
      <Three3D />
      <div className="stars" />

      {floatingLights.map((light) => (
        <span
          key={light.id}
          className="floating-light"
          style={{
            left: `${light.x}%`,
            top: `${light.y}%`,
            animationDelay: `${light.delay}s`,
            transform: `scale(${light.scale})`
          }}
        />
      ))}
      {accepted && (
        <div className="screen-celebration" aria-hidden="true">
          {celebrationBits.map((bit) => (
            <span
              key={bit.id}
              className={`celebration-bit ${bit.id % 3 === 0 ? "spark" : "confetti"}`}
              style={{
                left: `${bit.left}%`,
                animationDelay: `${bit.delay}s`,
                transform: `rotate(${bit.rotate}deg)`
              }}
            />
          ))}
        </div>
      )}

      <section
        className={`card-shell ${accepted ? "accepted" : ""}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        <div className="card-glow" />
        <div className="card">
          <p className="letter-seal">Hogsmeade Owl Post</p>
          <h1>Hi Vibha, Will You Be My Valentine?</h1>
          <p className="message">
            If love is the strongest magic, then I want to cast mine with you.
            Meet me under the enchanted sky and let us write our own story.
          </p>

          {!accepted ? (
            <div className="actions">
              <button 
                className="yes" 
                onClick={handleYesClick}
                style={{ 
                  transform: `scale(${yesButtonScale})`,
                  transformOrigin: "center center",
                  padding: `${yesButtonPadding}rem 1.2rem`,
                  opacity: yesButtonOpacity
                }}
              >
                Yes, always
              </button>
              <button
                className="no"
                onClick={() => setNoClicks((prev) => prev + 1)}
                style={{
                  opacity: noButtonOpacity,
                  transform: `scale(${noButtonScale})`,
                  pointerEvents: noProgress >= 1 ? "none" : "auto"
                }}
              >
                {noButtonLabel}
              </button>
            </div>
          ) : (
            <div className="accepted-box">
              <h2>She said yes.</h2>
              <p>
                Mischief managed. Your date at the Three Broomsticks begins now.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
