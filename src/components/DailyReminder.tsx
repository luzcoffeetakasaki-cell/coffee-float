"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timestamp } from "firebase/firestore";

interface Post {
    createdAt: any;
    userId: string;
}

interface DailyReminderProps {
    posts: Post[];
    currentUserId: string | null;
    onOpenPost: () => void;
}

export default function DailyReminder({ posts, currentUserId, onOpenPost }: DailyReminderProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!currentUserId) return;

        const checkDailyLog = () => {
            // 1. Check if suppressed for today via localStorage
            const lastDismissed = localStorage.getItem("coffee_float_reminder_dismissed");
            const today = new Date().toDateString();

            if (lastDismissed === today) {
                return;
            }

            // 2. Check if user already posted today
            const hasPostedToday = posts.some(post => {
                if (post.userId !== currentUserId) return false;

                let postDate: Date;
                if (post.createdAt?.toDate) {
                    postDate = post.createdAt.toDate();
                } else if (post.createdAt?.seconds) {
                    postDate = new Date(post.createdAt.seconds * 1000);
                } else {
                    return false; // Invalid date
                }

                return postDate.toDateString() === today;
            });

            // Show if not posted today
            if (!hasPostedToday) {
                // Delay slightly for better UX (don't show immediately on mount)
                setTimeout(() => {
                    setIsVisible(true);
                }, 2000);
            }
        };

        checkDailyLog();
    }, [posts, currentUserId]);

    const handleDismiss = () => {
        setIsVisible(false);
        // Suppress for the rest of the day
        const today = new Date().toDateString();
        localStorage.setItem("coffee_float_reminder_dismissed", today);
    };

    const handleOpen = () => {
        setIsVisible(false);
        onOpenPost();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        position: "fixed",
                        bottom: "8rem", // Positioned above bottom nav
                        left: "1.5rem",
                        right: "1.5rem",
                        zIndex: 90,
                        display: "flex",
                        justifyContent: "center",
                        pointerEvents: "none" // Allow clicks pass through transparent areas
                    }}
                >
                    <div style={{
                        background: "rgba(30, 20, 15, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(198, 166, 100, 0.3)",
                        borderRadius: "1rem",
                        padding: "1rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        maxWidth: "400px",
                        width: "100%",
                        pointerEvents: "auto"
                    }}>
                        <div style={{ fontSize: "2rem" }}>☕️</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--accent-gold)", marginBottom: "0.2rem" }}>
                                今日の一杯は？
                            </div>
                            <div style={{ fontSize: "0.8rem", opacity: 0.8, color: "white" }}>
                                ほっとする時間を記録しよう。
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                onClick={handleDismiss}
                                style={{
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "white",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem",
                                    fontSize: "0.8rem",
                                    cursor: "pointer"
                                }}
                            >
                                あとで
                            </button>
                            <button
                                onClick={handleOpen}
                                style={{
                                    background: "var(--accent-gold)",
                                    border: "none",
                                    color: "#1e0f0a",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontWeight: "bold",
                                    fontSize: "0.8rem",
                                    cursor: "pointer"
                                }}
                            >
                                書く
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
