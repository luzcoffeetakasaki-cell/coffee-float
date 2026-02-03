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

const TRIVIA_POSTS: Post[] = [
    { id: "trivia1", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：発見の伝説", location: "エチオピア", flavorText: "コーヒーは9世紀頃、ヤギ飼いのカルディが「ヤギが赤い実を食べて興奮している」のを見て発見されたと言われています🐐", flavorStamp: "BITTER", likes: 100, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia2", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カフェイン量", location: "焙煎所", flavorText: "実は「深煎り」よりも「浅煎り」の方が、豆の体積あたりのカフェイン含有量は少し多いんですよ💡", flavorStamp: "JUICY", likes: 82, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia3", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：種です", location: "農園", flavorText: "コーヒー豆は「豆」と呼ばれていますが、植物学的には「コーヒーノキの果実（チェリー）の種」なんです🍒", flavorStamp: "SWEET", likes: 95, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia4", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：語源", location: "アラビア", flavorText: "「コーヒー（Coffee）」の語源は、アラビア語の「カフワ（Qahwa/ワインの意味）」から来ています🍷", flavorStamp: "FLORAL", likes: 76, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia5", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：消費量", location: "フィンランド", flavorText: "世界で一番コーヒーを飲む国はフィンランド！一人当たり1日4〜5杯も飲むそうですよ🇫🇮", flavorStamp: "JUICY", likes: 120, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia6", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：アメリカーノ", location: "イタリア", flavorText: "「アメリカーノ」は、第二次大戦中に米兵がエスプレッソをお湯で薄めて飲んだのが始まりだとか🇺🇸", flavorStamp: "BITTER", likes: 64, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia7", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：世界三大", location: "タンザニア", flavorText: "世界三大コーヒーといえば、「ブルーマウンテン（ジャマイカ）」「コナ（ハワイ）」そして「キリマンジャロ（タンザニア）」です⛰️", flavorStamp: "BITTER", likes: 88, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia8", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：デカフェ", location: "実験室", flavorText: "デカフェ（カフェインレス）でも、実はごく微量のカフェインは残っていることが多いんです☕️", flavorStamp: "SWEET", likes: 55, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia9", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カプチーノ", location: "修道院", flavorText: "「カプチーノ」の名前は、カプチン修道会の修道士が着ていた茶色の服の色に似ていたから…という説があります🙏", flavorStamp: "SWEET", likes: 90, createdAt: { toDate: () => new Date() } as any },
    { id: "trivia10", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：エスプレッソ", location: "イタリア", flavorText: "「エスプレッソ」はイタリア語で「急行」の意味。「注文を受けてから急速に淹れる」ことから来ています🚆", flavorStamp: "BITTER", likes: 110, createdAt: { toDate: () => new Date() } as any },
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
            setPosts(TRIVIA_POSTS);
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
                // データが空の場合は豆知識（Bot）を表示
                setPosts(newPosts.length > 0 ? newPosts : TRIVIA_POSTS);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase connection error. Falling back to DEMO MODE.", error);
            setPosts(TRIVIA_POSTS);
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
