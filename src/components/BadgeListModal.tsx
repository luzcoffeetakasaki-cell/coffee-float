"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/data/badges";

interface BadgeListModalProps {
    isOpen: boolean;
    onClose: () => void;
    badges: Badge[];
    earnedBadges: string[];
    onSelectBadge: (badge: Badge, isEarned: boolean) => void;
}

export default function BadgeListModal({ isOpen, onClose, badges, earnedBadges, onSelectBadge }: BadgeListModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(5px)",
                    zIndex: 2000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem"
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "linear-gradient(135deg, rgba(30,20,15,0.95) 0%, rgba(10,5,5,0.98) 100%)",
                        border: "1px solid rgba(198, 166, 100, 0.3)",
                        borderRadius: "1.5rem",
                        padding: "1.5rem",
                        width: "100%",
                        maxWidth: "500px",
                        maxHeight: "85vh",
                        overflowY: "auto",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        position: "relative"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", position: "sticky", top: 0, zIndex: 10 }}>
                        <h3 style={{ fontSize: "1.2rem", color: "var(--accent-gold)", fontWeight: "bold" }}>
                            Badge Collection 🏅
                        </h3>
                        <button
                            onClick={onClose}
                            style={{
                                background: "rgba(255,255,255,0.1)",
                                border: "none",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                color: "white",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                        gap: "1.2rem",
                        justifyItems: "center",
                        paddingBottom: "1rem"
                    }}>
                        {badges.map((badge) => {
                            const isEarned = earnedBadges.includes(badge.id);
                            return (
                                <motion.div
                                    key={badge.id}
                                    whileHover={isEarned ? { scale: 1.1 } : {}}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        cursor: isEarned ? "pointer" : "default",
                                        opacity: isEarned ? 1 : 0.4,
                                        textAlign: "center"
                                    }}
                                    onClick={() => onSelectBadge(badge, isEarned)}
                                >
                                    <div style={{
                                        width: "64px",
                                        height: "64px",
                                        borderRadius: "50%",
                                        background: isEarned
                                            ? "linear-gradient(135deg, rgba(198,166,100,0.3) 0%, rgba(198,166,100,0.1) 100%)"
                                            : "rgba(255,255,255,0.05)",
                                        border: isEarned
                                            ? "2px solid var(--accent-gold)"
                                            : "2px dashed rgba(255,255,255,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "2rem",
                                        filter: isEarned ? "none" : "grayscale(100%) blur(1px)",
                                        boxShadow: isEarned ? "0 0 15px rgba(198,166,100,0.2)" : "none",
                                        transition: "all 0.3s ease"
                                    }}>
                                        {isEarned ? badge.icon : badge.secret ? "?" : badge.icon}
                                    </div>
                                    <div style={{
                                        fontSize: "0.7rem",
                                        fontWeight: "bold",
                                        color: isEarned ? "var(--accent-gold)" : "rgba(255,255,255,0.4)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%"
                                    }}>
                                        {isEarned ? badge.name : "Locked"}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
