"use client";

import { useState } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
    id: string;
    nickname: string;
    coffeeName: string;
    location: string;
    flavorText: string;
    flavorStamp?: string | null;
    likes: number;
    createdAt: any; // Firebase Timestamp
}

const STAMPS: Record<string, { color: string; icon: string }> = {
    SWEET: { color: "#FF8DA1", icon: "🍬" },
    JUICY: { color: "#FFB347", icon: "🍊" },
    BITTER: { color: "#A67C52", icon: "☕" },
    FLORAL: { color: "#B39DDB", icon: "🌸" },
};

interface DetailModalProps {
    post: Post | null;
    onClose: () => void;
}

const SHARE_BASE_URL = "https://coffee-float-x8lg.vercel.app/share";

export default function DetailModal({ post, onClose }: DetailModalProps) {
    if (!post) return null;

    const [particles, setParticles] = useState<{ id: number; x: number; y: number; icon: string }[]>([]);

    const handleShare = async () => {
        const shareUrl = `${SHARE_BASE_URL}/${post.id}`;
        const shareText = `${post.coffeeName} - ${post.flavorText} #CoffeeFloat`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Coffee Float",
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.log("Share canceled");
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert("リンクをコピーしました！📋");
        }
    };

    const handleCheers = async () => {
        if (!post) return;
        try {
            const postRef = doc(db, "posts", post.id);
            await updateDoc(postRef, {
                likes: increment(1)
            });
            // 楽観的UI更新はonSnapshotに任せるか、必要ならローカルstate導入

            // パーティクルエフェクト追加
            const icons = ["🥂", "✨", "🎉", "☕️"];
            const newParticles = Array.from({ length: 3 }).map((_, i) => ({
                id: Date.now() + i,
                x: Math.random() * 60 - 30, // -30 to 30
                y: Math.random() * -20,
                icon: icons[Math.floor(Math.random() * icons.length)]
            }));
            setParticles(prev => [...prev, ...newParticles]);

        } catch (error) {
            console.error("Cheers failed", error);
        }
    };

    const dateStr = post.createdAt?.toDate?.()
        ? post.createdAt.toDate().toLocaleString("ja-JP")
        : "たった今";

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(6px)",
            }}
            onClick={onClose}
        >
            <div
                className="glass-panel"
                style={{
                    width: "90%",
                    maxWidth: "450px",
                    padding: "2rem",
                    borderRadius: "2rem",
                    color: "var(--text-main)",
                    position: "relative",
                    animation: "drift 20s infinite ease-in-out",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1.5rem",
                        background: "none",
                        border: "none",
                        color: "var(--accent-gold)",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                    }}
                    onClick={onClose}
                >
                    ×
                </button>

                <div style={{ marginBottom: "0.5rem", opacity: 0.7, fontSize: "0.8rem" }}>
                    {dateStr} @ {post.location || "どこか"}
                </div>
                {post.flavorStamp && STAMPS[post.flavorStamp] && (
                    <div style={{
                        display: "inline-block",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "1rem",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        backgroundColor: `${STAMPS[post.flavorStamp].color}22`,
                        color: STAMPS[post.flavorStamp].color,
                        border: `1px solid ${STAMPS[post.flavorStamp].color}`,
                        marginBottom: "0.8rem"
                    }}>
                        {STAMPS[post.flavorStamp].icon} {post.flavorStamp}
                    </div>
                )}
                <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>
                    {post.coffeeName}
                </h2>

                <div style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.6",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "1rem",
                    marginBottom: "1.5rem"
                }}>
                    {post.flavorText}
                </div>

                <div style={{ textAlign: "right", opacity: 0.8, marginBottom: "2rem" }}>
                    — {post.nickname}
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", position: "relative" }}>
                    <AnimatePresence>
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 1, y: 0, x: p.x, scale: 0.5 }}
                                animate={{ opacity: 0, y: -100, scale: 1.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: "50%",
                                    fontSize: "1.5rem",
                                    pointerEvents: "none",
                                    zIndex: 10
                                }}
                                onAnimationComplete={() => setParticles(prev => prev.filter(i => i.id !== p.id))}
                            >
                                {p.icon}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.button
                        onClick={handleCheers}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            padding: "0.8rem 2rem",
                            borderRadius: "2rem",
                            border: "none",
                            backgroundColor: "var(--accent-gold)",
                            color: "#000",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            boxShadow: "0 4px 15px rgba(198, 166, 100, 0.4)",
                            outline: "none"
                        }}
                    >
                        🥂 乾杯！ ({post.likes || 0})
                    </motion.button>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
                    <button
                        onClick={handleShare}
                        style={{
                            padding: "0.8rem 2rem",
                            borderRadius: "2rem",
                            border: "none",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            color: "var(--text-main)",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "background 0.2s"
                        }}
                    >
                        📤 シェアする
                    </button>
                    {/* LINEで直接開くボタン (Optional) */}
                    <a
                        href={`https://line.me/R/msg/text/?${encodeURIComponent(`${post.coffeeName} #CoffeeFloat\n${SHARE_BASE_URL}/${post.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: "0.8rem 2rem",
                            borderRadius: "2rem",
                            border: "none",
                            backgroundColor: "#06C755", // LINE Green
                            color: "white",
                            textDecoration: "none",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        LINEで送る
                    </a>
                </div>
            </div>
        </div>
    );
}
