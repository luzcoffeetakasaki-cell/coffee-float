"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Post {
    id: string;
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
        nickname: "深煎りマニア",
        coffeeName: "マンデリン G1",
        location: "自宅キッチン",
        flavorText: "ガツンとくる苦味とこく。バターたっぷりトーストに最高に合う☕️",
        flavorStamp: "BITTER",
        likes: 3,
        createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) } as any,
    },
    {
        id: "mock3",
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
                    <Bubble key={post.id} post={post} index={index} onClick={() => setSelectedPost(post)} />
                ))}
            </div>
            <DetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        </>
    );
}

function Bubble({ post, index, onClick }: { post: Post; index: number; onClick: () => void }) {
    // ランダムな位置とアニメーションの時間設定
    const [style, setStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        const randomX = Math.random() * 80 + 5; // 5% - 85%
        const randomY = Math.random() * 80 + 5; // 5% - 85%
        const durationX = 15 + Math.random() * 20;
        const durationY = 10 + Math.random() * 15;
        const delay = -Math.random() * 20;

        setStyle({
            left: `${randomX}%`,
            top: `${randomY}%`,
            animation: `floatX ${durationX}s ease-in-out ${delay}s infinite, floatY ${durationY}s ease-in-out ${delay}s infinite`,
        });
    }, []);

    const stamp = post.flavorStamp ? STAMPS[post.flavorStamp] : null;

    return (
        <div className="bubble" style={style} onClick={onClick}>
            {stamp && (
                <div style={{
                    fontSize: "0.6rem",
                    fontWeight: "bold",
                    color: stamp.color,
                    marginBottom: "0.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem"
                }}>
                    <span>{stamp.icon}</span>{post.flavorStamp}
                </div>
            )}
            <div><strong>{post.coffeeName}</strong></div>
            <div style={{ opacity: 0.8, fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" }}>
                {post.flavorText}
            </div>
        </div>
    );
}
