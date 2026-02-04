"use client";

import FloatingArea from "@/components/FloatingArea";
import PostForm from "@/components/PostForm";
import Disclaimer from "@/components/Disclaimer";
import CoffeeLog from "@/components/CoffeeLog";
import BeanList from "@/components/BeanList";
import LineOpenBanner from "@/components/LineOpenBanner";
import CafeSearch from "@/components/CafeSearch"; // Added CafeSearch import
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getCurrentUserId } from "@/lib/auth";

type TabType = "home" | "log" | "beans" | "explore"; // Updated TabType

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("home"); // Updated activeTab state type
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      const id = await getCurrentUserId();
      if (!id) return;

      const q = query(
        collection(db, "notifications"),
        where("toUserId", "==", id),
        where("read", "==", false)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        setUnreadCount(snapshot.size);
      });
    };

    init();
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <main style={{ height: "100dvh", position: "relative", overflow: "hidden" }}>
      {/* Header Area */}
      <div style={{
        position: "fixed",
        top: "calc(1.5rem + var(--safe-top))",
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ width: "100%", height: "100%" }}
          >
            {activeTab === "home" && <FloatingArea />}
            {activeTab === "log" && <CoffeeLog />}
            {activeTab === "beans" && <BeanList />}
            {activeTab === "explore" && <CafeSearch />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Suspense fallback={null}>
        <PostForm showTriggerButton={activeTab === "home"} />
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
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />
    </main>
  );
}
