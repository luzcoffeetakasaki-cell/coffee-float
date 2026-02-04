"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, increment, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentUserId } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
    id: string;
    userId: string; // 通知用に追加
    nickname: string;
    coffeeName: string;
    coffeeOrigin?: string;
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
    const [currentLikes, setCurrentLikes] = useState(post.likes);
    const isTrivia = post.userId === "master";

    // 編集・削除用ステート
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCoffeeName, setEditCoffeeName] = useState(post.coffeeName);
    const [editCoffeeOrigin, setEditCoffeeOrigin] = useState(post.coffeeOrigin || "");
    const [editLocation, setEditLocation] = useState(post.location);
    const [editFlavorText, setEditFlavorText] = useState(post.flavorText);
    const [editFlavorStamp, setEditFlavorStamp] = useState(post.flavorStamp);

    // オーナー確認
    useEffect(() => {
        getCurrentUserId().then(id => {
            if (id && id === post.userId) {
                setIsOwner(true);
            }
        });
    }, [post.userId]);

    // Propsの更新
    if (post.likes !== currentLikes && post.likes > currentLikes) {
        setCurrentLikes(post.likes);
    }

    const handleDelete = async () => {
        if (!confirm("本当にこの投稿を削除しますか？\n（削除すると元に戻せません）")) return;
        try {

            await deleteDoc(doc(db, "posts", post.id));
            alert("投稿を削除しました🗑️");
            onClose();
        } catch (e) {
            console.error("Delete failed", e);
            alert("削除に失敗しました...");
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedData = {
                coffeeName: editCoffeeName,
                coffeeOrigin: editCoffeeOrigin,
                location: editLocation,
                flavorText: editFlavorText,
                flavorStamp: editFlavorStamp,
                updatedAt: serverTimestamp()
            };
            await updateDoc(doc(db, "posts", post.id), updatedData);

            // ローカルの表示も更新（親コンポーネントの再レンダリングを待たずに反映させるため）
            post.coffeeName = editCoffeeName;
            post.coffeeOrigin = editCoffeeOrigin;
            post.location = editLocation;
            post.flavorText = editFlavorText;
            post.flavorStamp = editFlavorStamp;

            setIsEditing(false);
            alert("投稿を更新しました✨");
        } catch (e) {
            console.error("Update failed", e);
            alert("更新に失敗しました...");
        }
    };

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
            // 楽観的UI更新
            setCurrentLikes(prev => prev + 1);

            // パーティクルエフェクト追加
            const icons = ["🥂", "✨", "🎉", "☕️"];
            const newParticles = Array.from({ length: 3 }).map((_, i) => ({
                id: Date.now() + i,
                x: Math.random() * 60 - 30, // -30 to 30
                y: Math.random() * -20,
                icon: icons[Math.floor(Math.random() * icons.length)]
            }));
            setParticles(prev => [...prev, ...newParticles]);

            // 通知作成
            const fromUserId = await getCurrentUserId();
            // 自分の投稿への乾杯は通知しない & 相手がいる場合のみ
            if (fromUserId && post.userId && fromUserId !== post.userId) {
                const notificationId = `cheer_${fromUserId}_${post.id}`;
                const notificationRef = doc(db, "notifications", notificationId);
                const savedNickname = localStorage.getItem("coffee_float_nickname") || "名無しの誰か";

                await setDoc(notificationRef, {
                    toUserId: post.userId,
                    fromUserId: fromUserId,
                    postId: post.id,
                    coffeeName: post.coffeeName,
                    type: "cheer",
                    senderNickname: savedNickname,
                    read: false,
                    createdAt: serverTimestamp(),
                }, { merge: true }); // ユニークIDなので、既存なら上書き（実質何もしない）
                console.log("Notification created successfully!");
            }

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
                <div style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1.5rem",
                    display: "flex",
                    gap: "1rem",
                    zIndex: 20
                }}>
                    {isOwner && !isEditing && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--accent-gold)",
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                    opacity: 0.8
                                }}
                            >
                                ✏️
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#FF6B6B",
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                    opacity: 0.8
                                }}
                            >
                                🗑️
                            </button>
                        </>
                    )}
                    <button
                        style={{
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
                </div>

                <div style={{ marginBottom: "0.5rem", opacity: 0.7, fontSize: "0.8rem" }}>
                    {!isTrivia && (
                        <>
                            {dateStr}
                            {isEditing ? (
                                <span style={{ marginLeft: "0.5rem" }}>
                                    @ <input
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        placeholder="場所"
                                        style={{
                                            background: "rgba(255,255,255,0.1)",
                                            border: "none",
                                            color: "white",
                                            padding: "0.2rem",
                                            borderRadius: "4px",
                                            fontSize: "0.8rem",
                                            width: "120px"
                                        }}
                                    />
                                </span>
                            ) : (
                                ` @ ${post.location || "どこか"}`
                            )}
                        </>
                    )}
                </div>

                {isTrivia ? (
                    /* 雑学タグ */
                    <div style={{
                        display: "inline-block",
                        padding: "0.4rem 1rem",
                        borderRadius: "1rem",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        backgroundColor: "rgba(198, 166, 100, 0.15)",
                        color: "var(--accent-gold)",
                        border: "1px solid rgba(198, 166, 100, 0.4)",
                        marginBottom: "1rem"
                    }}>
                        💡 豆知識
                    </div>
                ) : isEditing ? (
                    <div style={{ marginBottom: "1rem" }}>
                        {Object.entries(STAMPS).map(([key, s]) => (
                            <button
                                key={key}
                                onClick={() => setEditFlavorStamp(key)}
                                style={{
                                    display: "inline-block",
                                    padding: "0.3rem 0.6rem",
                                    borderRadius: "1rem",
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                    backgroundColor: editFlavorStamp === key ? `${s.color}44` : "rgba(255,255,255,0.05)",
                                    color: s.color,
                                    border: `1px solid ${s.color}`,
                                    marginRight: "0.5rem",
                                    marginBottom: "0.5rem",
                                    cursor: "pointer",
                                    opacity: editFlavorStamp === key ? 1 : 0.5
                                }}
                            >
                                {s.icon} {key}
                            </button>
                        ))}
                    </div>
                ) : (
                    post.flavorStamp && STAMPS[post.flavorStamp] && (
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
                    )
                )}

                {isEditing ? (
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                        <div style={{ flex: 2 }}>
                            <input
                                type="text"
                                value={editCoffeeName}
                                onChange={(e) => setEditCoffeeName(e.target.value)}
                                placeholder="品名..."
                                style={{
                                    fontSize: "1.2rem",
                                    padding: "0.8rem",
                                    background: "rgba(255,255,255,0.1)",
                                    border: "none",
                                    borderRadius: "0.8rem",
                                    color: "var(--accent-gold)",
                                    width: "100%",
                                    fontWeight: "bold"
                                }}
                            />
                        </div>
                        <div style={{ flex: 1.5 }}>
                            <input
                                type="text"
                                value={editCoffeeOrigin}
                                onChange={(e) => setEditCoffeeOrigin(e.target.value)}
                                placeholder="生産地..."
                                style={{
                                    fontSize: "1.2rem",
                                    padding: "0.8rem",
                                    background: "rgba(255,255,255,0.1)",
                                    border: "none",
                                    borderRadius: "0.8rem",
                                    color: "var(--accent-gold)",
                                    width: "100%",
                                    fontWeight: "bold"
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "0.2rem", lineHeight: "1.2" }}>
                            {post.coffeeName}
                        </h2>
                        {post.coffeeOrigin && (
                            <div style={{
                                fontSize: "1rem",
                                opacity: 0.7,
                                color: "var(--accent-gold)",
                                display: "inline-block",
                                borderBottom: "1px solid rgba(198, 166, 100, 0.3)"
                            }}>
                                {post.coffeeOrigin}
                            </div>
                        )}
                    </div>
                )}

                {isEditing ? (
                    <textarea
                        value={editFlavorText}
                        onChange={(e) => setEditFlavorText(e.target.value)}
                        placeholder="味わいや感想..."
                        rows={4}
                        style={{
                            fontSize: "1.1rem",
                            lineHeight: "1.6",
                            padding: "1rem",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "1rem",
                            marginBottom: "1.5rem",
                            width: "100%",
                            border: "none",
                            color: "var(--text-main)",
                            resize: "none"
                        }}
                    />
                ) : (
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
                )}

                {isEditing ? (
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
                        <button
                            onClick={() => setIsEditing(false)}
                            style={{
                                padding: "0.8rem 2rem",
                                borderRadius: "2rem",
                                border: "1px solid rgba(255,255,255,0.3)",
                                background: "transparent",
                                color: "var(--text-main)",
                                cursor: "pointer"
                            }}
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleUpdate}
                            style={{
                                padding: "0.8rem 2rem",
                                borderRadius: "2rem",
                                border: "none",
                                background: "var(--accent-gold)",
                                color: "#000",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            保存する
                        </button>
                    </div>
                ) : (
                    <>
                        {!isTrivia && (
                            <>
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
                                        🥂 乾杯！ ({currentLikes || 0})
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
                            </>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
