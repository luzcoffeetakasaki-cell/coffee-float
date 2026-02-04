"use client";

import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { getCurrentUserId } from "@/lib/auth";
import { TRIVIA_POSTS } from "@/data/triviaPosts";

interface Post {
    id: string;
    userId: string;
    nickname: string;
    coffeeName: string;
    location: string;
    flavorText: string;
    flavorStamp?: string | null;
    likes: number;
    createdAt: Timestamp;
}

import DetailModal from "./DetailModal";

const STAMPS: Record<string, { color: string; icon: string }> = {
    SWEET: { color: "#FF8DA1", icon: "🍬" },
    JUICY: { color: "#FFB347", icon: "🍊" },
    BITTER: { color: "#A67C52", icon: "☕" },
    FLORAL: { color: "#B39DDB", icon: "🌸" },
};


const getRandomTrivia = () => {
    const shuffled = [...TRIVIA_POSTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};



export default function FloatingArea() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [triviaItems, setTriviaItems] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [viewMode, setViewMode] = useState<"float" | "timeline">("float");

    useEffect(() => {
        getCurrentUserId().then(id => {
            setCurrentUserId(id);
            setIsLoadingUser(false);
        });
    }, []);

    // 雑学を2件ランダムに取得する関数
    const refreshTrivia = () => {
        const shuffled = [...TRIVIA_POSTS].sort(() => 0.5 - Math.random());
        setTriviaItems(shuffled.slice(0, 2) as any);
    };

    useEffect(() => {
        refreshTrivia();
        // 10分ごとに更新 (600,000ms)
        const interval = setInterval(refreshTrivia, 600000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Firebase設定が不完全な場合はデモ用データを表示
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            console.warn("Firebase API Key is missing. Running in DEMO MODE.");
            setPosts(getRandomTrivia() as any);
            return;
        }

        try {
            // 最新10件を取得
            const q = query(
                collection(db, "posts"),
                orderBy("createdAt", "desc"),
                limit(10)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newPosts = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Post[];
                setPosts(newPosts);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase connection error. Falling back to DEMO MODE.", error);
            setPosts(getRandomTrivia() as any);
        }
    }, []);

    return (
        <>
            {/* View Mode Toggle */}
            <div style={{
                position: "fixed",
                top: "calc(6rem + var(--safe-top))",
                right: "1.5rem",
                zIndex: 50,
                display: "flex",
                background: "rgba(30, 20, 15, 0.6)",
                backdropFilter: "blur(10px)",
                padding: "0.3rem",
                borderRadius: "2rem",
                border: "1px solid rgba(198, 166, 100, 0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}>
                <button
                    onClick={() => setViewMode("float")}
                    style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "1.5rem",
                        border: "none",
                        background: viewMode === "float" ? "var(--accent-gold)" : "transparent",
                        color: viewMode === "float" ? "#1e0f0a" : "white",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}
                >
                    Float 🫧
                </button>
                <button
                    onClick={() => setViewMode("timeline")}
                    style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "1.5rem",
                        border: "none",
                        background: viewMode === "timeline" ? "var(--accent-gold)" : "transparent",
                        color: viewMode === "timeline" ? "#1e0f0a" : "white",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}
                >
                    Timeline 📜
                </button>
            </div>

            <div
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: viewMode === "timeline" ? "auto" : "hidden",
                    paddingTop: viewMode === "timeline" ? "9rem" : "0",
                    paddingBottom: viewMode === "timeline" ? "8rem" : "0",
                    position: "relative",
                }}
            >
                <AnimatePresence mode="wait">
                    {viewMode === "float" ? (
                        <motion.div
                            key="float"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="floating-layer"
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                pointerEvents: "auto"
                            }}
                        >
                            {!isLoadingUser && [...posts, ...triviaItems].map((post, index) => {
                                // 100%の画面内に配置するためのグリッド計算
                                const columns = 3;
                                const gridX = index % columns;
                                const gridY = Math.floor(index / columns);

                                // 各セル内での位置を少しランダムに
                                const offsetX = 15 + Math.random() * 70;
                                const offsetY = 15 + Math.random() * 70;

                                const left = ((gridX + offsetX / 100) / columns) * 100;
                                const top = ((gridY + offsetY / 100) / 5) * 100; // 最大12個なので4-5行分

                                return (
                                    <Bubble
                                        key={post.id + index}
                                        post={post}
                                        index={index}
                                        initialLeft={`${left}%`}
                                        initialTop={`${top}%`}
                                        onClick={() => setSelectedPost(post)}
                                        isMine={currentUserId === post.userId}
                                    />
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{ padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
                        >
                            {/* タイムラインにはユーザーの投稿のみ表示（雑学を除外） */}
                            {posts.sort((a, b) => {
                                const timeA = a.createdAt?.toMillis?.() || 0;
                                const timeB = b.createdAt?.toMillis?.() || 0;
                                return timeB - timeA;
                            }).map((post) => (
                                <TimelineCard
                                    key={post.id}
                                    post={post}
                                    onClick={() => setSelectedPost(post)}
                                    isMine={currentUserId === post.userId}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <DetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        </>
    );
}

function TimelineCard({ post, onClick, isMine }: { post: Post; onClick: () => void; isMine: boolean }) {
    const isTrivia = post.userId === "master";
    const stamp = !isTrivia && post.flavorStamp ? STAMPS[post.flavorStamp] : null;

    return (
        <motion.div
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            style={{
                background: isMine
                    ? "linear-gradient(135deg, rgba(198, 166, 100, 0.15) 0%, rgba(30, 20, 15, 0.4) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                borderRadius: "1.5rem",
                padding: "1.2rem",
                border: isMine ? "1px solid rgba(198, 166, 100, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: isMine ? "0 4px 15px rgba(198, 166, 100, 0.1)" : "none"
            }}
        >
            <div style={{
                fontSize: "2rem",
                width: "3.5rem",
                height: "3.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "1rem",
                flexShrink: 0
            }}>
                {stamp ? stamp.icon : isTrivia ? "🎓" : "☕️"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.2rem" }}>
                    <h4 style={{
                        fontSize: "1rem",
                        color: isMine ? "var(--accent-gold)" : "white",
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}>
                        {post.coffeeName}
                    </h4>
                    <span style={{ fontSize: "0.7rem", opacity: 0.5, whiteSpace: "nowrap", marginLeft: "0.5rem" }}>
                        {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' }) : "たった今"}
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", opacity: 0.7, marginBottom: "0.5rem" }}>
                    <span>{post.nickname || "名無しのコーヒー好き"}</span>
                    {post.location && (
                        <>
                            <span>/</span>
                            <span>📍 {post.location}</span>
                        </>
                    )}
                </div>
                <p style={{
                    fontSize: "0.85rem",
                    opacity: 0.9,
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                }}>
                    {post.flavorText}
                </p>
            </div>
            <div style={{ padding: "0.5rem", opacity: 0.3 }}>
                <span style={{ fontSize: "1.2rem" }}>›</span>
            </div>
        </motion.div>
    );
}

function Bubble({ post, index, initialLeft, initialTop, onClick, isMine }: { post: Post; index: number; initialLeft: string; initialTop: string; onClick: () => void; isMine: boolean }) {
    // 浮遊アニメーション
    const [floatAnim, setFloatAnim] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setFloatAnim({
            x: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
            rotate: [0, Math.random() * 4 - 2, Math.random() * 4 - 2, 0],
            transition: {
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
            }
        });
    }, []);

    const isTrivia = post.userId === "master";
    // 雑学の場合は味わいタグ（スタンプ/アイコン）を表示しない
    const stamp = !isTrivia && post.flavorStamp ? STAMPS[post.flavorStamp] : null;

    if (!isMounted) return null;

    return (
        <motion.div
            className={`bubble ${isMine ? "my-post" : ""}`}
            style={{
                left: initialLeft,
                top: initialTop,
                position: 'absolute',
                transform: 'translate(-50%, -50%)', // 中心合わせ
                // カプセル型デザイン (Triviaは別デザイン)
                border: isMine ? "1px solid #C6A664" : isTrivia ? "1px dashed rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: isMine ? "0 4px 15px rgba(198, 166, 100, 0.4)" : "0 4px 10px rgba(0, 0, 0, 0.1)",
                background: isMine
                    ? "linear-gradient(135deg, rgba(60, 40, 30, 0.95) 0%, rgba(30, 15, 10, 0.95) 100%)"
                    : isTrivia
                        ? "rgba(40, 40, 50, 0.85)"
                        : "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                zIndex: isMine ? 100 : 10, // 自分の投稿を少し優先

                borderRadius: isTrivia ? "50%" : "50px", // 雑学は完全な円形
                padding: isTrivia ? "0" : "0.5rem 1rem",
                width: isTrivia ? "60px" : "auto",
                height: isTrivia ? "60px" : "auto",
                aspectRatio: isTrivia ? "1/1" : "auto",

                display: "flex",
                alignItems: "center",
                justifyContent: isTrivia ? "center" : "flex-start",
                gap: "0.8rem",
                cursor: "pointer",
            }}
            animate={floatAnim}
            drag
            dragMomentum={false}
            whileHover={{ scale: 1.05, cursor: "grab", zIndex: 200 }}
            whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: 200 }}
            onClick={onClick}
        >
            {isTrivia ? (
                /* 雑学：アイコンのみ表示 */
                <div style={{ fontSize: "1.5rem" }}>💡</div>
            ) : (
                <>
                    {/* スタンプ（アイコン） */}
                    {stamp && (
                        <div style={{
                            fontSize: "1.2rem",
                            filter: isMine ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                        }}>
                            {stamp.icon}
                        </div>
                    )}

                    {/* テキスト情報（縦並び） */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{
                            fontSize: "0.9rem",
                            color: isMine ? "#C6A664" : "#ffffff",
                            lineHeight: "1.2",
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                            marginBottom: "0.1rem",
                            textShadow: isMine ? "none" : "0 1px 2px rgba(0,0,0,0.5)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "150px" // コーヒー名の幅制限
                        }}>
                            {post.coffeeName}
                        </div>

                        {/* Footer: Nickname & Location */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.65rem",
                            opacity: 0.9
                        }}>
                            {post.nickname && (
                                <div style={{
                                    color: isMine ? "#d4c1aa" : "rgba(255, 255, 255, 0.8)",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "70px" // ニックネームの幅制限
                                }}>
                                    {post.nickname}
                                </div>
                            )}
                            {post.nickname && post.location && (
                                <span style={{ color: isMine ? "#a69b95" : "rgba(255,255,255,0.4)" }}>|</span>
                            )}
                            {post.location && (
                                <div style={{
                                    color: isMine ? "#8d7b68" : "rgba(255, 255, 255, 0.7)",
                                    whiteSpace: "nowrap",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.1rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "70px" // 場所の幅制限
                                }}>
                                    <span style={{ fontSize: "0.6rem" }}>📍</span>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{post.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
}
