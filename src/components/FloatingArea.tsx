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

    // 奥行きアニメーション用 (0: 奥, 1: 手前)
    // 自分の投稿は常に少し手前寄りにして見つけやすくする
    // const [depth, setDepth] = useState(isMine ? 0.8 : Math.random()); 

    useEffect(() => {
        // 初期位置 (画面端すぎないように)
        const left = Math.random() * 80 + 10; // 10% - 90%
        const top = Math.random() * 80 + 10; // 10% - 90%
        setInitialPos({ left: `${left}%`, top: `${top}%` });

        // 浮遊アニメーション (ランダムな動き)
        setFloatAnim({
            x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
            transition: {
                duration: 10 + Math.random() * 10, // 10-20秒
                repeat: Infinity,
                ease: "easeInOut",
            }
        });
    }, []);

    // 奥行きに基づいたスタイル計算
    // depthは現在state管理だが、Framer Motionで滑らかに補間する
    // バリエーション定義
    const transitionSettings: any = { // 型エラー回避のため any (Framer Motionの型定義が厳密なため)
        type: "spring",
        stiffness: 40,  // バネの強さ（低いほど柔らかい）
        damping: 15,    // 振動の抑え（低いほど揺れる）
        mass: 1.2       // 重さ（重いほどゆったり）
    };

    const variants: Variants = {
        far: {
            scale: 0.85,
            filter: "blur(1.5px)",
            opacity: 0.7,
            zIndex: 1,
            borderRadius: "50%",
            width: "90px",
            height: "90px",
            padding: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            transition: transitionSettings
        },
        near: {
            scale: 1.05, // 大きくしすぎないことで動きを上品に
            filter: "blur(0px)",
            opacity: 1,
            zIndex: 100,
            borderRadius: "24px",
            width: "auto",
            height: "auto",
            padding: "1.2rem",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            textAlign: "left",
            display: "block",
            transition: transitionSettings
        }
    };

    // 現在の状態（ランダムに切り替える）
    const [isNear, setIsNear] = useState(Math.random() > 0.5);

    useEffect(() => {
        const toggle = () => {
            setIsNear(prev => !prev);
            // 次の切り替えまでの時間をランダムに
            setTimeout(toggle, 8000 + Math.random() * 8000);
        };
        const timer = setTimeout(toggle, Math.random() * 5000);
        return () => clearTimeout(timer);
    }, []);

    const stamp = post.flavorStamp ? STAMPS[post.flavorStamp] : null;

    if (!initialPos) return null;

    return (
        <motion.div
            className={`bubble ${isMine ? "my-post" : ""}`}
            layout // レイアウト変更（サイズ変化）を滑らかに
            style={{
                left: initialPos.left,
                top: initialPos.top,
                position: 'absolute',
                border: isMine ? "1px solid #C6A664" : "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: isMine ? "0 4px 20px rgba(198, 166, 100, 0.4)" : "0 4px 15px rgba(0, 0, 0, 0.1)",
                background: isMine
                    ? "linear-gradient(135deg, rgba(60, 40, 30, 0.95) 0%, rgba(30, 15, 10, 0.95) 100%)" // 自分: 濃厚なコーヒー色
                    : "rgba(255, 255, 255, 0.1)", // 他人: 透過ガラス
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                // zIndex is controlled by variants
                padding: "1rem", // variantsで上書きされるが初期値として
                minWidth: "auto",
                maxWidth: "200px",
                cursor: "pointer",
            }}
            animate={floatAnim} // XYアニメーション
            drag // ドラッグ可能にする
            dragMomentum={false} // 離した時に慣性で飛ばないようにする
            whileHover={{ scale: 1.1, cursor: "grab" }}
            whileDrag={{ scale: 1.2, cursor: "grabbing" }}
            onClick={onClick}
        >
            {/* ここで2重motionにする */}
            <motion.div
                animate={isNear || isMine ? "near" : "far"} // 自分の投稿は常にNear(またはNear寄り)
                variants={variants}
                style={{ width: "100%", height: "100%" }}
            >
                {stamp && (
                    <div style={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: stamp.color,
                        marginBottom: "0.2rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem"
                    }}>
                        <span style={{ fontSize: "1rem" }}>{stamp.icon}</span>{post.flavorStamp}
                    </div>
                )}
                {/* Nickname Display */}
                {post.nickname && (
                    <div style={{
                        fontSize: "0.75rem",
                        color: isMine ? "#d4c1aa" : "rgba(255, 255, 255, 0.7)",
                        marginBottom: "0.1rem",
                        fontWeight: "bold"
                    }}>
                        @{post.nickname}
                    </div>
                )}
                <div style={{
                    fontSize: "1rem",
                    color: isMine ? "#C6A664" : "#ffffff", // 自分はゴールド、他人は白
                    marginBottom: "0.4rem",
                    lineHeight: "1.3"
                }}>
                    <strong>{post.coffeeName}</strong>
                </div>
                {/* コメント部分は Near の時だけ表示 (opacityアニメーション) */}
                <motion.div
                    animate={{
                        opacity: (isNear || isMine) ? 1 : 0,
                        height: (isNear || isMine) ? "auto" : 0,
                        marginBottom: (isNear || isMine) ? "0" : "0" // 詰める
                    }}
                    transition={{ duration: 1 }}
                    style={{
                        color: isMine ? "#f5ebe0" : "rgba(255, 255, 255, 0.9)",
                        fontSize: "0.85rem",
                        lineHeight: "1.5",
                        overflow: "hidden", // heightアニメーション用
                        fontWeight: "500",
                        textShadow: isMine ? "none" : "0 1px 3px rgba(0,0,0,0.5)"
                    }}
                >
                    <div style={{ // 内部divでLineClamp
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}>
                        {post.flavorText}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
