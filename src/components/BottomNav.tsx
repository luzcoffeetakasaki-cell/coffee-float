"use client";

import { motion } from "framer-motion";

type TabType = "home" | "log" | "beans";

interface BottomNavProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

const TABS = [
    { id: "home", label: "ホーム", icon: "🏠" },
    { id: "log", label: "ログ", icon: "📊" },
    { id: "beans", label: "豆", icon: "🫘" },
];

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
    return (
        <nav style={{
            position: "fixed",
            bottom: "calc(1.5rem + var(--safe-bottom))",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: "rgba(30, 20, 15, 0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "2.5rem",
            padding: "0.4rem",
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(198, 166, 100, 0.15)",
        }}>
            {/* Sliding Background Pill */}
            <div style={{ position: "relative", display: "flex", gap: "0.2rem" }}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            style={{
                                position: "relative",
                                background: "transparent",
                                border: "none",
                                borderRadius: "2rem",
                                padding: "0.7rem 1.4rem",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                color: isActive ? "#1e0f0a" : "rgba(255, 255, 255, 0.6)",
                                cursor: "pointer",
                                transition: "color 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                zIndex: 2,
                                outline: "none",
                                WebkitTapHighlightColor: "transparent",
                            }}
                        >
                            <span style={{ fontSize: "1.1rem" }}>{tab.icon}</span>
                            <span className="nav-label" style={{
                                display: isActive ? "inline" : "none",
                                whiteSpace: "nowrap"
                            }}>{tab.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "var(--accent-gold)",
                                        borderRadius: "2rem",
                                        zIndex: -1,
                                        boxShadow: "0 4px 15px rgba(198, 166, 100, 0.3)",
                                    }}
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
