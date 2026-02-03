"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, Timestamp, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentUserId, isGuestUserId, getStoredDeviceId } from "@/lib/auth";
import { login } from "@/lib/liff";
import { writeBatch, getDocs } from "firebase/firestore";

interface Post {
    id: string;
    coffeeName: string;
    flavorText: string;
    flavorStamp?: string | null;
    createdAt: Timestamp;
}

interface Notification {
    id: string;
    postId: string;
    coffeeName: string;
    senderNickname: string;
    read: boolean;
    createdAt: Timestamp;
}

const STAMPS: Record<string, { color: string; icon: string; message: string }> = {
    SWEET: { color: "#FF8DA1", icon: "🍬", message: "あなたは甘いひとときを大切にするタイプ。自分へのご褒美を忘れない優しい心の持ち主ですね。" },
    JUICY: { color: "#FFB347", icon: "🍊", message: "あなたは冒険心あふれるフルーティー派。新しい発見や驚きを求めて、毎日を鮮やかに彩る人です。" },
    BITTER: { color: "#A67C52", icon: "☕", message: "あなたは落ち着きのあるビター派。物事の本質を見極め、静かな時間を楽しめる大人な魅力があります。" },
    FLORAL: { color: "#B39DDB", icon: "🌸", message: "あなたは華やかな香りを愛するロマンチスト。繊細な感性を大切にし、日常に美しさを見つける達人です。" },
};

export default function MyPage({ onClose }: { onClose: () => void }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [stats, setStats] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const id = await getCurrentUserId();
            setUserId(id);

            // データ移行（ゲストID -> LINE ID）のチェック
            const storedGuestId = getStoredDeviceId();
            if (id && !isGuestUserId(id) && storedGuestId && isGuestUserId(storedGuestId)) {
                // ログイン済みだが、ローカルにゲストIDが残っている場合 = 移行が必要
                migrateGuestData(storedGuestId, id);
            }

            setLoading(false);
        };
        init();
    }, []);

    const migrateGuestData = async (guestId: string, lineId: string) => {
        try {
            const q = query(
                collection(db, "posts"),
                where("userId", "==", guestId)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) return;

            const batch = writeBatch(db);
            snapshot.docs.forEach((docSnap) => {
                batch.update(docSnap.ref, { userId: lineId });
            });
            await batch.commit();
            console.log(`Migrated ${snapshot.size} posts from ${guestId} to ${lineId}`);

            // 移行完了後、混乱を避けるためゲストIDは削除（または無効化）
            // ここではlocalStorageから消す
            localStorage.removeItem("coffee_float_device_userId");
        } catch (error) {
            console.error("Migration failed", error);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, "posts"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newPosts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Post[];
            setPosts(newPosts);

            // 統計の計算
            const newStats: Record<string, number> = {};
            newPosts.forEach(p => {
                if (p.flavorStamp) {
                    newStats[p.flavorStamp] = (newStats[p.flavorStamp] || 0) + 1;
                }
            });
            setStats(newStats);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    // 通知の取得
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, "notifications"),
            where("toUserId", "==", userId)
            // 一旦シンプルにしてインデックスエラーを回避
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Notification[];
            setNotifications(newNotifications);
        }, (error) => {
            console.error("Notification listener failed:", error);
            setNotifications([]);
        });

        return () => unsubscribe();
    }, [userId]);

    const markAsRead = async (notificationId: string) => {
        try {
            const batch = writeBatch(db);
            const ref = doc(db, "notifications", notificationId);
            batch.update(ref, { read: true });
            await batch.commit();
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const batch = writeBatch(db);
            notifications.forEach((n) => {
                const ref = doc(db, "notifications", n.id);
                batch.update(ref, { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const topStamp = Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0];

    return (
        <div className="glass-panel" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 150,
            overflowY: "auto",
            padding: "2rem",
            color: "var(--text-main)",
        }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)" }}>My Coffee Karte 📊</h2>
                <button onClick={onClose} style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent-gold)",
                    fontSize: "2rem",
                    cursor: "pointer"
                }}>×</button>
            </header>

            {loading ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>分析中...☕️</div>
            ) : (
                <>
                    {/* ゲストへの案内 */}
                    {userId && isGuestUserId(userId) && (
                        <section style={{
                            background: "linear-gradient(135deg, #06C755 0%, #05a345 100%)",
                            padding: "1.5rem",
                            borderRadius: "1.5rem",
                            marginBottom: "2rem",
                            color: "white",
                            boxShadow: "0 4px 15px rgba(6, 199, 85, 0.3)"
                        }}>
                            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>LINEと連携しませんか？ 🔗</h3>
                            <p style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "1.2rem", lineHeight: "1.5" }}>
                                現在はゲストとして利用中です。LINEと連携すると、機種変更しても大切なコーヒーログを安全に引き継げます。
                            </p>
                            <button
                                onClick={() => login()}
                                style={{
                                    width: "100%",
                                    padding: "0.8rem",
                                    borderRadius: "0.8rem",
                                    border: "none",
                                    backgroundColor: "white",
                                    color: "#06C755",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem"
                                }}
                            >
                                <span style={{ fontSize: "1.2rem" }}>💬</span> LINEで連携して保存する
                            </button>
                        </section>
                    )}

                    {/* お知らせセクション */}
                    {notifications.length > 0 && (
                        <section style={{ marginBottom: "2rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <h3 style={{ fontSize: "1rem", opacity: 0.8 }}>お知らせ 🔔</h3>
                                <button
                                    onClick={markAllAsRead}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "var(--accent-gold)",
                                        fontSize: "0.75rem",
                                        cursor: "pointer",
                                        textDecoration: "underline"
                                    }}
                                >
                                    すべて既読にする
                                </button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                {notifications.map((n) => (
                                    <div key={n.id} style={{
                                        background: "linear-gradient(135deg, rgba(198, 166, 100, 0.2) 0%, rgba(198, 166, 100, 0.05) 100%)",
                                        padding: "1rem",
                                        borderRadius: "1rem",
                                        border: "1px solid rgba(198, 166, 100, 0.3)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        animation: "fadeIn 0.5s ease-out"
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                                                🥂 {n.senderNickname}さんがあなたの「{n.coffeeName}」に乾杯しました！
                                            </p>
                                            <p style={{ fontSize: "0.7rem", opacity: 0.6, marginTop: "0.2rem" }}>
                                                {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString("ja-JP") : "たった今"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            style={{
                                                background: "rgba(255,255,255,0.1)",
                                                border: "none",
                                                color: "var(--text-main)",
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "15px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            ✓
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* コーヒーカルテ（分析） */}
                    <section style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "1.5rem",
                        borderRadius: "1.5rem",
                        marginBottom: "2rem",
                        border: "1px solid var(--glass-border)"
                    }}>
                        <h3 style={{ fontSize: "1rem", marginBottom: "1rem", opacity: 0.8 }}>味わい分析結果 🧠</h3>
                        {topStamp ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <div style={{ fontSize: "3rem" }}>{STAMPS[topStamp].icon}</div>
                                <div>
                                    <p style={{ fontWeight: "bold", color: STAMPS[topStamp].color, fontSize: "1.1rem" }}>
                                        あなたは「{topStamp}」派ですね！
                                    </p>
                                    <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", lineHeight: "1.5" }}>
                                        {STAMPS[topStamp].message}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p style={{ fontSize: "0.9rem" }}>まだ投稿がありません。コーヒーの思い出をシェアして、あなたの好みを分析しましょう！</p>
                        )}
                    </section>

                    {/* 投稿履歴 */}
                    <section>
                        <h3 style={{ fontSize: "1rem", marginBottom: "1rem", opacity: 0.8 }}>最近のログ 📜</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {posts.map(post => (
                                <div key={post.id} style={{
                                    padding: "1rem",
                                    background: "rgba(0,0,0,0.2)",
                                    borderRadius: "1rem",
                                    border: "1px solid rgba(255,255,255,0.1)"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                        <span style={{ fontWeight: "bold" }}>{post.coffeeName}</span>
                                        {post.flavorStamp && (
                                            <span style={{ fontSize: "0.8rem", color: STAMPS[post.flavorStamp].color }}>
                                                {STAMPS[post.flavorStamp].icon} {post.flavorStamp}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>{post.flavorText}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
