"use client";

import { useState, Suspense } from "react";
import FloatingArea from "@/components/FloatingArea";
import PostForm from "@/components/PostForm";
import Disclaimer from "@/components/Disclaimer";
import CoffeeLog from "@/components/CoffeeLog";
import BeanList from "@/components/BeanList";
import LineOpenBanner from "@/components/LineOpenBanner";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "log" | "beans">("home");

  return (
    <main style={{ height: "100dvh", position: "relative", overflow: "hidden" }}>
      {/* Header Area (Visible only on Home?) Decision: Visible on both for branding */}
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
      </div>

      {/* Main Content Area */}
      <div style={{ width: "100%", height: "100%" }}>
        {activeTab === "home" ? (
          <FloatingArea />
        ) : activeTab === "log" ? (
          <CoffeeLog />
        ) : (
          <BeanList />
        )}
      </div>

      <Suspense fallback={null}>
        <PostForm />
      </Suspense>
      <Disclaimer />
      <LineOpenBanner />

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

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 90,
        background: "rgba(30, 15, 10, 0.8)",
        backdropFilter: "blur(10px)",
        borderRadius: "2rem",
        padding: "0.5rem",
        display: "flex",
        gap: "0.5rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        border: "1px solid rgba(198, 166, 100, 0.2)"
      }}>
        <button
          onClick={() => setActiveTab("home")}
          style={{
            background: activeTab === "home" ? "var(--accent-gold)" : "transparent",
            color: activeTab === "home" ? "#1e0f0a" : "var(--accent-gold)",
            border: "none",
            borderRadius: "1.5rem",
            padding: "0.8rem 1.5rem", // Slightly larger hit area
            fontSize: "0.9rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span>🏠</span> ホーム
        </button>
        <button
          onClick={() => setActiveTab("log")}
          style={{
            background: activeTab === "log" ? "var(--accent-gold)" : "transparent",
            color: activeTab === "log" ? "#1e0f0a" : "var(--accent-gold)",
            border: "none",
            borderRadius: "1.5rem",
            padding: "0.8rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span>📊</span> ログ
        </button>
        <button
          onClick={() => setActiveTab("beans")}
          style={{
            background: activeTab === "beans" ? "var(--accent-gold)" : "transparent",
            color: activeTab === "beans" ? "#1e0f0a" : "var(--accent-gold)",
            border: "none",
            borderRadius: "1.5rem",
            padding: "0.8rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span>🫘</span> 豆
        </button>
      </div>
    </main>
  );
}
