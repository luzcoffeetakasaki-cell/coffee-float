"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, Variants } from "framer-motion";
import { getCurrentUserId } from "@/lib/auth";

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

const MOCK_POSTS: Post[] = [
    {
        id: "mock1",
        userId: "mock_user_1",
        nickname: "エチオピア好き",
        coffeeName: "エチオピア イルガチェフェ",
        location: "お気に入りのカフェ",
        flavorText: "フローラルで華やかな香りがたまらない！✨ 紅茶みたいにスッキリしてる。",
        flavorStamp: "FLORAL",
        likes: 5,
        createdAt: { toDate: () => new Date() } as any,
    },
    {
        id: "mock2",
        userId: "mock_user_2",
        nickname: "深煎りマニア",
        coffeeName: "マンデリン G1",
        location: "自宅キッチン",
        flavorText: "ガツンとくる苦味とこく. バターたっぷりトーストに最高に合う☕️",
        flavorStamp: "BITTER",
        likes: 3,
        createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) } as any,
    },
    {
        id: "mock3",
        userId: "mock_user_3",
        nickname: "旅するカフェ店員",
        coffeeName: "ゲイシャ ナチュラル",
        location: "代々木公園",
        flavorText: "ジャスミンみたいな香りと、冷めてからのベリー系の甘みが最高...！",
        flavorStamp: "JUICY",
        likes: 10,
        createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 2) } as any,
    },
];

export default function FloatingArea() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUserId().then(setCurrentUserId);
    }, []);

    useEffect(() => {
        // Firebase設定が不完全な場合はデモ用データを表示
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            console.warn("Firebase API Key is missing. Running in DEMO MODE.");
            setPosts(MOCK_POSTS);
            return;
        }

        try {
            // 最新50件を取得
            const q = query(
                collection(db, "posts"),
                orderBy("createdAt", "desc"),
                limit(50)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newPosts = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Post[];
                // データが空の場合はモックを表示
                setPosts(newPosts.length > 0 ? newPosts : MOCK_POSTS);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase connection error. Falling back to DEMO MODE.", error);
            setPosts(MOCK_POSTS);
        }
    }, []);

    return (
        <>
            <div className="floating-layer">
                {posts.map((post, index) => (
                    <Bubble
                        key={post.id}
                        post={post}
                        index={index}
                        onClick={() => setSelectedPost(post)}
                        isMine={currentUserId === post.userId}
                    />
                ))}
            </div>
            <DetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        </>
    );
}

function Bubble({ post, index, onClick, isMine }: { post: Post; index: number; onClick: () => void; isMine: boolean }) {
    // ランダムな位置
    const [initialPos, setInitialPos] = useState<{ left: string; top: string } | null>(null);
    const [floatAnim, setFloatAnim] = useState<any>(null);

    useEffect(() => {
        // 初期位置
        const left = Math.random() * 80 + 10;
        const top = Math.random() * 80 + 10;
        setInitialPos({ left: `${left}%`, top: `${top}%` });

        // 浮遊アニメーション
        setFloatAnim({
            x: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
            rotate: [0, Math.random() * 4 - 2, Math.random() * 4 - 2, 0], // ほんの少し揺らす
            transition: {
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
            }
        });
    }, []);

    const stamp = post.flavorStamp ? STAMPS[post.flavorStamp] : null;

    if (!initialPos) return null;

    return (
        <motion.div
            className={`bubble ${isMine ? "my-post" : ""}`}
            style={{
                left: initialPos.left,
                top: initialPos.top,
                position: 'absolute',
                // カプセル型デザイン
                border: isMine ? "1px solid #C6A664" : "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: isMine ? "0 4px 15px rgba(198, 166, 100, 0.4)" : "0 4px 10px rgba(0, 0, 0, 0.1)",
                background: isMine
                    ? "linear-gradient(135deg, rgba(60, 40, 30, 0.95) 0%, rgba(30, 15, 10, 0.95) 100%)"
                    : "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                zIndex: isMine ? 100 : 10, // 自分の投稿を少し優先

                borderRadius: "50px", // 完全なカプセル形状
                padding: "0.5rem 1rem",
                width: "auto",
                maxWidth: "240px",
                height: "auto",

                display: "flex",
                alignItems: "center",
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
        </motion.div>
    );
}
