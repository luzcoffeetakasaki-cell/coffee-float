"use client";

import { useState, Suspense } from "react";
import FloatingArea from "@/components/FloatingArea";
import PostForm from "@/components/PostForm";
import Disclaimer from "@/components/Disclaimer";
import CoffeeLog from "@/components/CoffeeLog";
import BeanList from "@/components/BeanList";
import LineOpenBanner from "@/components/LineOpenBanner";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "log" | "beans">("home");

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

      {/* Modern Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
