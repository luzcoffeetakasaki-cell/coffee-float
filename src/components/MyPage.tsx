"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getLiffProfile, login } from "@/lib/liff";

interface Post {
    id: string;
    coffeeName: string;
    flavorText: string;
    flavorStamp?: string | null;
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
    const [userId, setUserId] = useState<string | null>(null);
    const [stats, setStats] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const profile = await getLiffProfile();
            if (profile?.userId) {
                setUserId(profile.userId);
            } else {
                login(); // マイページを開くにはログインが必要
                setLoading(false);
            }
        };
        init();
    }, []);

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
