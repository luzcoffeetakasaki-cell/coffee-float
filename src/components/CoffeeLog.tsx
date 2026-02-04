"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, Timestamp, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentUserId, isGuestUserId, getStoredDeviceId } from "@/lib/auth";
import { login } from "@/lib/liff";
import { writeBatch, getDocs } from "firebase/firestore";
import { usePWA } from "@/hooks/usePWA";
import { motion, AnimatePresence } from "framer-motion";
import DetailModal from "./DetailModal";
import { BADGES, Badge } from "@/data/badges";

interface Post {
    id: string;
    userId: string;
    nickname: string;
    coffeeName: string;
    location: string;
    flavorText: string;
    flavorStamp?: string | null;
    isFavorite?: boolean;
    aging?: number | null;
    likes: number;
    createdAt: Timestamp;
}

interface Bean {
    id: string;
    name: string;
    shopName?: string;
    origin?: string;
    process?: string;
    roastDate: string;
    notes?: string;
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

const FLAVOR_KEYWORDS: Record<string, { category: string; keywords: string[]; icon: string; color: string }> = {
    FRUITY: { category: "フルーティー", keywords: ["柑橘", "シトラス", "ベリー", "フルーツ", "酸味", "レモン", "オレンジ", "グレープ"], icon: "🍋", color: "#FFB347" },
    SWEET: { category: "スイート/リッチ", keywords: ["チョコ", "キャラメル", "甘み", "コク", "バニラ", "蜂蜜", "シュガー", "まろやか"], icon: "🍫", color: "#FF8DA1" },
    FLORAL: { category: "フローラル/ハーブ", keywords: ["花", "フローラル", "ハーブ", "香り", "ジャスミン", "ローズ", "ティー", "紅茶"], icon: "🌸", color: "#B39DDB" },
    ROASTY: { category: "ロースティー/ナッツ", keywords: ["香ばしい", "ナッツ", "スモーキー", "苦味", "アーモンド", "深み", "焙煎"], icon: "🌰", color: "#A67C52" },
};

const MOOD_REC_MAP: Record<string, { beans: string; roast: string; trait: string; advice: string; icon: string }> = {
    "疲れた": { beans: "ブラジル・ショコラ", roast: "深煎り", trait: "チョコレートのような甘みと深いコク", advice: "頑張った自分を、どっしりとしたコクで包み込んで。ミルクをたっぷり入れても最高だよ！", icon: "🥱" },
    "スッキリ": { beans: "エチオピア・イルガチェフェ", roast: "浅煎り", trait: "紅茶のような香りとレモンのような爽やかさ", advice: "澄み渡るような香りで、気分をリセット！アイスコーヒーにするとさらにクリアに。", icon: "✨" },
    "集中したい": { beans: "ケニア", roast: "中深煎り", trait: "力強いボティとベリー系の鮮やかな酸味", advice: "キレのある酸味が脳をシャキッとさせてくれるはず。作業のお供にはブラックがおすすめ！", icon: "💻" },
    "幸せ": { beans: "コスタリカ・ハニー", roast: "中煎り", trait: "ハチミツを思わせる優しい甘みと華やかな香り", advice: "今のマスターのハッピーな気分を、もっと甘く華やかに彩ってくれること間違いなし！", icon: "🥰" },
    "リラックス": { beans: "グアテマラ", roast: "中煎り", trait: "チョコレートやナッツの香ばしさとバランスの良さ", advice: "お気に入りの音楽を聴きながら、ゆっくりと時間をかけて味わって。ホッと一息つけるよ。", icon: "🌿" },
    "元気": { beans: "エチオピア（ナチュラル）", roast: "中煎り", trait: "熟したベリーのような濃密な香り", advice: "まるでストロベリーのような圧倒的な香り。個性を楽しみたい元気な午後にぴったりのエネルギー系！", icon: "🍓" },
    "落ち着く": { beans: "ホンジュラス", roast: "中煎り", trait: "華やかで上品な香り", advice: "優しい酸味と甘みのバランスが、安らぎの時間にぴったり。優雅な気分に浸りたい時に。", icon: "🌸" },
};

export default function CoffeeLog() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [stats, setStats] = useState<Record<string, number>>({});
    const [keywordStats, setKeywordStats] = useState<Record<string, number>>({});
    const [beans, setBeans] = useState<Bean[]>([]);
    const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [nickname, setNickname] = useState("");
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);

    // Mood Rec States
    const [moodQuery, setMoodQuery] = useState("");
    const [recommendation, setRecommendation] = useState<typeof MOOD_REC_MAP[keyof typeof MOOD_REC_MAP] | null>(null);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [isNotifCollapsed, setIsNotifCollapsed] = useState(true);
    const isPWA = usePWA();

    useEffect(() => {
        const storedName = localStorage.getItem("coffee_float_nickname");
        if (storedName) setNickname(storedName);
    }, []);

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

            // 統計とキーワードの計算
            const newStats: Record<string, number> = {};
            const newKeywordStats: Record<string, number> = {};

            newPosts.forEach(p => {
                const weight = p.isFavorite ? 3 : 1;

                // スタンプの統計
                if (p.flavorStamp) {
                    newStats[p.flavorStamp] = (newStats[p.flavorStamp] || 0) + weight;
                }

                // キーワードの抽出
                Object.entries(FLAVOR_KEYWORDS).forEach(([key, info]) => {
                    info.keywords.forEach(word => {
                        if (p.flavorText.includes(word)) {
                            newKeywordStats[key] = (newKeywordStats[key] || 0) + weight;
                        }
                    });
                });
            });

            setStats(newStats);
            setKeywordStats(newKeywordStats);
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
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Notification[];

            // クライアントサイドでソート（インデックス不足対策）
            newNotifications.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });

            setNotifications(newNotifications);
        }, (error) => {
            console.error("Notification listener failed:", error);
            setNotifications([]);
        });

        return () => unsubscribe();
    }, [userId]);

    // 豆リストの取得（バッジ計算用）
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, "beans"),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newBeans = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Bean[];
            setBeans(newBeans);
        });

        return () => unsubscribe();
    }, [userId]);

    // バッジの計算
    useEffect(() => {
        const earned = BADGES
            .filter(badge => badge.condition({ posts, beans }))
            .map(badge => badge.id);
        setEarnedBadges(earned);
    }, [posts, beans]);

    const unreadCount = notifications.filter(n => !n.read).length;

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
                if (!n.read) { // Only mark unread ones
                    const ref = doc(db, "notifications", n.id);
                    batch.update(ref, { read: true });
                }
            });
            await batch.commit();
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const topStamp = Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0];

    const handleGetRecommendation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!moodQuery.trim()) return;

        setIsAnalysing(true);
        setRecommendation(null);

        // 抽出アニメーション用に少し待つ
        await new Promise(resolve => setTimeout(resolve, 2000));

        const query = moodQuery.toLowerCase();
        let found = null;

        // キーワードマッチング
        for (const [key, details] of Object.entries(MOOD_REC_MAP)) {
            if (query.includes(key)) {
                found = details;
                break;
            }
        }

        // デフォルト（見つからない場合）
        if (!found) {
            found = {
                beans: "コロンビア",
                roast: "中煎り",
                trait: "バランスの取れた味わいと華やかな香り",
                advice: "何にでも合う万能な一杯。今のマスターの気分を優しく包み込んでくれるはずだよ。",
                icon: "☕️"
            };
        }

        setRecommendation(found);
        setIsAnalysing(false);
    };

    return (
        <div style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            padding: "6rem 1.5rem 8rem 1.5rem", // Header and TabBar offset
            color: "var(--text-main)",
        }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "0.2rem" }}>My Coffee Karte 📊</h2>
                    <div style={{ fontSize: "0.9rem", opacity: 0.8, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {isEditingName ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    localStorage.setItem("coffee_float_nickname", nickname);
                                    setIsEditingName(false);
                                }}
                                style={{ display: "flex", gap: "0.5rem" }}
                            >
                                <input
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    style={{
                                        padding: "0.2rem 0.5rem",
                                        borderRadius: "0.3rem",
                                        border: "1px solid var(--accent-gold)",
                                        background: "rgba(0,0,0,0.3)",
                                        color: "white",
                                        fontSize: "16px"
                                    }}
                                    autoFocus
                                />
                                <button type="submit" style={{ cursor: "pointer", background: "none", border: "none" }}>✅</button>
                            </form>
                        ) : (
                            <>
                                <span>👤 {nickname || "名無しのコーヒー好き"}</span>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", opacity: 0.7 }}
                                >
                                    ✏️
                                </button>
                            </>
                        )}
                    </div>
                </div>
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
                                disabled={isPWA}
                                style={{
                                    width: "100%",
                                    padding: "0.8rem",
                                    borderRadius: "0.8rem",
                                    border: "none",
                                    backgroundColor: isPWA ? "rgba(255,255,255,0.5)" : "white",
                                    color: isPWA ? "#666" : "#06C755",
                                    fontWeight: "bold",
                                    cursor: isPWA ? "not-allowed" : "pointer",
                                    fontSize: "0.9rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem"
                                }}
                            >
                                <span style={{ fontSize: "1.2rem" }}>💬</span> {isPWA ? "LINE連携はブラウザ版のみ対応" : "LINEで連携して保存する"}
                            </button>
                            {isPWA && (
                                <p style={{ fontSize: "0.75rem", marginTop: "0.8rem", opacity: 0.8, background: "rgba(0,0,0,0.1)", padding: "0.5rem", borderRadius: "0.5rem" }}>
                                    ⚠️ アプリ版（ホーム画面追加）ではLINEログインの仕様上、連携が正常に動作しない場合があります。
                                    <br />
                                    確実にデータを引き継ぐには、SafariやChromeなどのブラウザで開き直してください。
                                </p>
                            )}
                        </section>
                    )}

                    {/* お知らせセクション */}
                    <section style={{ marginBottom: "2rem" }}>
                        <div className="glass-panel" style={{ padding: "1.2rem", borderRadius: "1.5rem" }}>
                            <div
                                onClick={() => setIsNotifCollapsed(!isNotifCollapsed)}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    marginBottom: isNotifCollapsed ? "0" : "1.2rem"
                                }}
                            >
                                <h3 style={{ fontSize: "1.1rem", color: "var(--accent-gold)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    お知らせ
                                    {unreadCount > 0 && (
                                        <span style={{ background: "#ff4b2b", color: "white", fontSize: "0.7rem", padding: "0.1rem 0.5rem", borderRadius: "1rem" }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </h3>
                                <motion.span
                                    animate={{ rotate: isNotifCollapsed ? 0 : 180 }}
                                    style={{ fontSize: "1.2rem", opacity: 0.5 }}
                                >
                                    ▼
                                </motion.span>
                            </div>

                            <AnimatePresence>
                                {!isNotifCollapsed && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                            {notifications.length === 0 ? (
                                                <p style={{ fontSize: "0.85rem", opacity: 0.5, textAlign: "center", padding: "1rem" }}>まだ通知はありません</p>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div key={n.id} style={{
                                                        padding: "0.8rem",
                                                        background: n.read ? "rgba(255,255,255,0.03)" : "rgba(198, 166, 100, 0.1)",
                                                        borderRadius: "0.8rem",
                                                        fontSize: "0.85rem",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        border: n.read ? "1px solid transparent" : "1px solid rgba(198, 166, 100, 0.3)",
                                                        position: "relative"
                                                    }}>
                                                        <div style={{ paddingRight: "0.5rem" }}>
                                                            🥂 {n.senderNickname}さんがあなたの「{n.coffeeName}」に乾杯しました！
                                                            {!n.read && <span style={{ marginLeft: "0.5rem", color: "var(--accent-gold)", fontSize: "0.7rem" }}>●</span>}
                                                            <p style={{ fontSize: "0.7rem", opacity: 0.6, marginTop: "0.2rem" }}>
                                                                {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString("ja-JP") : "たった今"}
                                                            </p>
                                                        </div>
                                                        {!n.read && (
                                                            <button
                                                                onClick={() => markAsRead(n.id)}
                                                                style={{
                                                                    flexShrink: 0,
                                                                    background: "var(--accent-gold)",
                                                                    color: "#1e0f0a",
                                                                    border: "none",
                                                                    borderRadius: "0.5rem",
                                                                    padding: "0.3rem 0.6rem",
                                                                    fontSize: "0.7rem",
                                                                    fontWeight: "bold",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                確認
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                style={{
                                                    width: "100%",
                                                    marginTop: "1rem",
                                                    padding: "0.5rem",
                                                    background: "rgba(198, 166, 100, 0.2)",
                                                    border: "1px solid rgba(198, 166, 100, 0.3)",
                                                    borderRadius: "0.8rem",
                                                    color: "var(--accent-gold)",
                                                    fontSize: "0.8rem",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                すべて既読にする
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* ムード・ペアリングセクション */}
                    <section style={{ marginBottom: "2rem" }}>
                        <div className="glass-panel" style={{
                            padding: "1.5rem",
                            borderRadius: "1.5rem",
                            background: "linear-gradient(135deg, rgba(198, 166, 100, 0.1) 0%, rgba(30, 20, 15, 0.4) 100%)",
                            border: "1px solid rgba(198, 166, 100, 0.2)"
                        }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--accent-gold)" }}>Mood Pairing 🧠💭</h3>
                            <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "1.2rem", lineHeight: "1.4" }}>今の気分にぴったりの一杯を提案するよ。</p>

                            <form onSubmit={handleGetRecommendation} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                <input
                                    placeholder="例: スッキリしたい、疲れた..."
                                    value={moodQuery}
                                    onChange={(e) => setMoodQuery(e.target.value)}
                                    style={{
                                        flex: "1 1 200px", // Allow shrinking but prefer 200px
                                        padding: "0.8rem 1rem",
                                        borderRadius: "0.8rem",
                                        background: "rgba(0,0,0,0.3)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "white",
                                        fontSize: "16px",
                                        outline: "none",
                                        minWidth: 0 // Prevent overflow in flex container
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={isAnalysing}
                                    style={{
                                        flex: "1 0 auto",
                                        padding: "0.8rem 1.2rem",
                                        borderRadius: "0.8rem",
                                        background: "var(--accent-gold)",
                                        border: "none",
                                        color: "var(--bg-deep)",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        opacity: isAnalysing ? 0.6 : 1
                                    }}
                                >
                                    {isAnalysing ? "分析中..." : "診断 ✨"}
                                </button>
                            </form>

                            <AnimatePresence mode="wait">
                                {isAnalysing ? (
                                    <motion.div
                                        key="analysing"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{ textAlign: "center", padding: "1rem" }}
                                    >
                                        <div style={{ fontSize: "2rem", marginBottom: "1rem", animation: "spin 2s linear infinite" }}>⏳</div>
                                        <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>今のマスターに合う魔法の一杯を抽出中...</p>
                                    </motion.div>
                                ) : recommendation ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            background: "rgba(255,255,255,0.05)",
                                            padding: "1.2rem",
                                            borderRadius: "1rem",
                                            border: "1px solid rgba(198, 166, 100, 0.3)"
                                        }}
                                    >
                                        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                                            <div style={{ fontSize: "2.5rem", flexShrink: 0 }}>{recommendation.icon}</div>
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontSize: "0.65rem", color: "var(--accent-gold)", fontWeight: "bold", letterSpacing: "1px", marginBottom: "0.2rem", whiteSpace: "nowrap" }}>RECOMMENDED BEANS</div>
                                                <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "white", wordBreak: "break-word" }}>{recommendation.beans}</div>
                                                <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>Roast: {recommendation.roast}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "0.8rem", background: "rgba(0,0,0,0.2)", padding: "0.8rem", borderRadius: "0.6rem", marginBottom: "1rem", borderLeft: "3px solid var(--accent-gold)", wordBreak: "break-word" }}>
                                            <strong>特徴:</strong> {recommendation.trait}
                                        </div>
                                        <p style={{ fontSize: "0.85rem", lineHeight: "1.6", opacity: 0.9, wordBreak: "break-word" }}>
                                            {recommendation.advice}
                                        </p>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* Badge Collection Section */}
                    <section style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "1.5rem",
                        borderRadius: "1.5rem",
                        marginBottom: "2rem",
                        border: "1px solid var(--glass-border)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ fontSize: "1rem", opacity: 0.8 }}>Badge Collection 🏅</h3>
                            <span style={{ fontSize: "0.75rem", background: "var(--accent-gold)", color: "#1e0f0a", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontWeight: "bold" }}>
                                {earnedBadges.length} / {BADGES.length}
                            </span>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                            gap: "1rem",
                            justifyItems: "center"
                        }}>
                            {BADGES.map((badge) => {
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
                                        onClick={() => {
                                            if (isEarned) {
                                                alert(`${badge.name}\n\n${badge.description}`);
                                            } else {
                                                alert(`獲得ヒント:\n${badge.hint}`);
                                            }
                                        }}
                                    >
                                        <div style={{
                                            width: "56px",
                                            height: "56px",
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
                                            fontSize: "1.8rem",
                                            filter: isEarned ? "none" : "grayscale(100%) blur(1px)",
                                            boxShadow: isEarned ? "0 0 15px rgba(198,166,100,0.2)" : "none"
                                        }}>
                                            {isEarned ? badge.icon : "？"}
                                        </div>
                                        <div style={{
                                            fontSize: "0.6rem",
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
                    </section>

                    {/* コーヒーカルテ（高度な分析） */}
                    <section style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "1.5rem",
                        borderRadius: "1.5rem",
                        marginBottom: "2rem",
                        border: "1px solid var(--glass-border)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                            <h3 style={{ fontSize: "1rem", opacity: 0.8 }}>Taste Radar 🧠 Analysis</h3>
                            <span style={{ fontSize: "0.75rem", background: "var(--accent-gold)", color: "#1e0f0a", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontWeight: "bold" }}>
                                {posts.length} Logs Analyzed
                            </span>
                        </div>

                        {topStamp ? (
                            <div>
                                {/* 味覚チャート */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "2rem" }}>
                                    {Object.entries(STAMPS).map(([key, info]) => {
                                        const count = stats[key] || 0;
                                        const totalWeight = Object.values(stats).reduce((a, b) => a + b, 0);
                                        const percent = totalWeight > 0 ? (count / totalWeight) * 100 : 0;
                                        return (
                                            <div key={key}>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                                                    <span>{info.icon} {key}</span>
                                                    <span style={{ opacity: 0.7 }}>{Math.round(percent)}%</span>
                                                </div>
                                                <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percent}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        style={{ height: "100%", background: info.color }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div style={{
                                    padding: "1.2rem",
                                    background: "rgba(198, 166, 100, 0.1)",
                                    borderRadius: "1rem",
                                    border: "1px solid rgba(198, 166, 100, 0.2)"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.8rem" }}>
                                        <div style={{ fontSize: "2rem" }}>{STAMPS[topStamp].icon}</div>
                                        <div>
                                            <p style={{ fontWeight: "bold", color: STAMPS[topStamp].color, fontSize: "1rem" }}>
                                                {topStamp} Profile Detected
                                            </p>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: "0.85rem", lineHeight: "1.6", opacity: 0.9 }}>
                                        {STAMPS[topStamp].message}
                                    </p>

                                    <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed rgba(198, 166, 100, 0.3)" }}>
                                        <h4 style={{ fontSize: "0.8rem", color: "var(--accent-gold)", marginBottom: "0.8rem" }}>💡 あなたの感性に寄り添ったアドバイス</h4>
                                        <div style={{ marginBottom: "1rem" }}>
                                            <p style={{ fontSize: "0.85rem", opacity: 0.9, lineHeight: "1.6", background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "0.8rem", borderLeft: "4px solid var(--accent-gold)" }}>
                                                {(() => {
                                                    const topKeyword = Object.entries(keywordStats).sort((a, b) => b[1] - a[1])[0]?.[0];
                                                    if (topKeyword) {
                                                        const info = FLAVOR_KEYWORDS[topKeyword];
                                                        const detectedWords = posts
                                                            .map(p => info.keywords.filter(w => p.flavorText.includes(w)))
                                                            .flat()
                                                            .filter((v, i, a) => a.indexOf(v) === i)
                                                            .slice(0, 3);

                                                        return `最近のコメントからは「${detectedWords.join('・')}」といった言葉がよく見られますね。マスターの繊細な味覚は、特に ${info.category} なニュアンスを敏感にキャッチしているようです。こういった深みのある表現を大切にするマスターには、次はこんな体験が合うかもしれません。`;
                                                    }
                                                    return "まだコメントによる分析が少ないですが、スタンプの傾向からは以下の豆がおすすめです。";
                                                })()}
                                            </p>
                                        </div>
                                        <p style={{ fontSize: "0.8rem", opacity: 0.8, lineHeight: "1.5" }}>
                                            {topStamp === "FRUITY" || topStamp === "JUICY" ?
                                                "浅煎りのエチオピアやケニアがおすすめ！ワインのような芳醇な香りを楽しめるはず。" :
                                                topStamp === "BITTER" ?
                                                    "深煎りのブラジルやマンデリンが相性抜群。しっかりとしたボディとコクを堪能してみて。" :
                                                    topStamp === "SWEET" ?
                                                        "中煎りのコロンビアやグアテマラがぴったり。キャラメルのような甘みを感じてみて。" :
                                                        "ゲイシャ種やウォッシュド精製の豆を探してみて。驚くほどクリーンで華やかな体験が待っています。"
                                            }
                                        </p>
                                    </div>

                                    {/* 頻出キーワードタグ */}
                                    <div style={{ marginTop: "1.2rem" }}>
                                        <p style={{ fontSize: "0.7rem", opacity: 0.6, marginBottom: "0.5rem" }}>Detected Flavor Vocabulary</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                            {Object.entries(keywordStats)
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([key, count]) => (
                                                    <span key={key} style={{
                                                        fontSize: "0.7rem",
                                                        background: `${FLAVOR_KEYWORDS[key].color}22`,
                                                        color: FLAVOR_KEYWORDS[key].color,
                                                        padding: "0.2rem 0.5rem",
                                                        borderRadius: "0.4rem",
                                                        border: `1px solid ${FLAVOR_KEYWORDS[key].color}44`
                                                    }}>
                                                        {FLAVOR_KEYWORDS[key].icon} {FLAVOR_KEYWORDS[key].category}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p style={{ fontSize: "0.9rem", textAlign: "center", padding: "1rem", opacity: 0.6 }}>
                                まだ十分なデータがありません。<br />ログを増やして、あなたの「味覚の地図」を完成させましょう！
                            </p>
                        )}
                    </section>

                    {/* 投稿履歴 */}
                    <section>
                        <h3 style={{ fontSize: "1rem", marginBottom: "1rem", opacity: 0.8 }}>最近のログ 📜</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {posts.map(post => (
                                <motion.div
                                    key={post.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedPost(post)}
                                    style={{
                                        padding: "1rem",
                                        background: "rgba(0,0,0,0.2)",
                                        borderRadius: "1rem",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        cursor: "pointer"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <span style={{ fontWeight: "bold" }}>{post.coffeeName}</span>
                                            {post.isFavorite && <span style={{ fontSize: "1rem" }}>❤️</span>}
                                        </div>
                                        {post.flavorStamp && (
                                            <span style={{ fontSize: "0.8rem", color: STAMPS[post.flavorStamp].color }}>
                                                {STAMPS[post.flavorStamp].icon} {post.flavorStamp}
                                            </span>
                                        )}
                                    </div>
                                    {post.aging !== undefined && post.aging !== null && (
                                        <div style={{ marginBottom: "0.5rem" }}>
                                            <span style={{
                                                fontSize: "0.7rem",
                                                opacity: 0.6,
                                                background: "rgba(255,255,255,0.05)",
                                                padding: "0.2rem 0.5rem",
                                                borderRadius: "0.5rem"
                                            }}>
                                                ⏳ エイジング: {post.aging}日目
                                            </span>
                                        </div>
                                    )}
                                    <p style={{
                                        fontSize: "0.9rem",
                                        opacity: 0.8,
                                        display: "-webkit-box",
                                        WebkitLineClamp: "2",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden"
                                    }}>{post.flavorText}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </>
            )}
            <DetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        </div>
    );
}
