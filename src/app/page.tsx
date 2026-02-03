"use client";

import { useState, Suspense } from "react";
import FloatingArea from "@/components/FloatingArea";
import PostForm from "@/components/PostForm";
import Disclaimer from "@/components/Disclaimer";
import MyPage from "@/components/MyPage";

export default function Home() {
  const [showMyPage, setShowMyPage] = useState(false);

  return (
    <main style={{ height: "100dvh", position: "relative", overflow: "hidden" }}>
      {/* Header Area */}
      <div style={{
        position: "fixed",
        top: "1.5rem",
        left: "1.5rem",
        zIndex: 10,
        pointerEvents: "none"
      }}>
        <h1 style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          color: "var(--accent-gold)",
          letterSpacing: "0.1em",
          textShadow: "0 2px 10px rgba(0,0,0,0.5)"
        }}>
          Coffee Float
        </h1>
        <p style={{
          fontSize: "0.8rem",
          opacity: 0.6,
          marginTop: "0.2rem"
        }}>
          今、この瞬間の美味しいを。
        </p>
        <button
          onClick={() => setShowMyPage(true)}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "1rem",
            border: "1px solid var(--accent-gold)",
            backgroundColor: "rgba(198, 166, 100, 0.1)",
            color: "var(--accent-gold)",
            fontSize: "0.8rem",
            cursor: "pointer",
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          📊 マイページ
        </button>
      </div>

      <FloatingArea />
      <Suspense fallback={null}>
        <PostForm />
      </Suspense>
      <Disclaimer />

      {showMyPage && <MyPage onClose={() => setShowMyPage(false)} />}

      {/* Background Decor */}
      <div style={{
        position: "fixed",
        bottom: "-100px",
        left: "-100px",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(198, 166, 100, 0.05) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />
    </main>
  );
}
