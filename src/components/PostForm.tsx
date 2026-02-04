"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { getCurrentUserId } from "@/lib/auth";
import { checkNgWords } from "@/lib/filter";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { query, collection, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export default function PostForm() {
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [nickname, setNickname] = useState("");
    const [coffeeName, setCoffeeName] = useState("");
    const [location, setLocation] = useState("");
    const [flavorText, setFlavorText] = useState("");
    const [flavorStamp, setFlavorStamp] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [aging, setAging] = useState<number | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // Renamed from isSuccess
    const [showShareModal, setShowShareModal] = useState(false);
    const [isShutterMode, setIsShutterMode] = useState(false);
    const [lastSharedData, setLastSharedData] = useState<any>(null);
    const [recentLocations, setRecentLocations] = useState<string[]>([]);
    const [ngWarning, setNgWarning] = useState<string | null>(null);

    const STAMPS = [
        { label: "SWEET", color: "#FF8DA1", icon: "🍬" },
        { label: "JUICY", color: "#FFB347", icon: "🍊" },
        { label: "BITTER", color: "#A67C52", icon: "☕" },
        { label: "FLORAL", color: "#B39DDB", icon: "🌸" },
    ];

    // URLパラメータの取得 & ニックネームの読み込み & イベントリスナー
    useEffect(() => {
        const savedNickname = localStorage.getItem("coffee_float_nickname");
        if (savedNickname) {
            setNickname(savedNickname);
        }

        const fetchProfileAndHistory = async () => {
            const id = await getCurrentUserId();
            setUserId(id);

            if (id) {
                const q = query(
                    collection(db, "posts"),
                    where("userId", "==", id),
                    orderBy("createdAt", "desc"),
                    limit(20)
                );
                const snapshot = await getDocs(q);
                const locations = snapshot.docs
                    .map(doc => doc.data().location as string)
                    .filter(loc => loc && loc.trim() !== "");
                // ユニークな直近の場所を取得
                const uniqueLocs = Array.from(new Set(locations)).slice(0, 3);
                setRecentLocations(uniqueLocs);
            }
        };
        fetchProfileAndHistory();

        // 豆リストからの自動入力イベント
        const handleOpenPost = (e: any) => {
            const { coffeeName, location, roastDate } = e.detail;
            setCoffeeName(coffeeName || "");
            setLocation(location || "");

            if (roastDate) {
                const roast = new Date(roastDate);
                const today = new Date();
                const oneDay = 24 * 60 * 60 * 1000;
                const roastDateOnly = new Date(roast.getFullYear(), roast.getMonth(), roast.getDate());
                const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const diff = Math.round((todayDateOnly.getTime() - roastDateOnly.getTime()) / oneDay);
                setAging(diff);
            } else {
                setAging(null);
            }

            setIsOpen(true);
        };

        window.addEventListener("coffee-float:open-post", handleOpenPost);

        // ?cafe=店舗名 があれば自動入力
        const getCafeFromUrl = () => {
            const fromParams = searchParams.get("cafe");
            if (fromParams) return fromParams;
            if (typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                return params.get("cafe");
            }
            return null;
        };

        const cafeParam = getCafeFromUrl();
        if (cafeParam) {
            setLocation(cafeParam);
            // 少し遅延させて、マウント後に確実に開くようにする
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 500);
            return () => {
                clearTimeout(timer);
                window.removeEventListener("coffee-float:open-post", handleOpenPost);
            };
        }

        return () => {
            window.removeEventListener("coffee-float:open-post", handleOpenPost);
        };
    }, [searchParams]);

    const handleCloseModalAndReset = () => {
        setCoffeeName("");
        setLocation("");
        setFlavorText("");
        setFlavorStamp(null);
        setIsFavorite(false);
        setAging(null);
        setIsOpen(false);
        setShowSuccess(false);
        setShowShareModal(false);
        setIsSubmitting(false);
        setIsShutterMode(false);
        setLastSharedData(null);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("シェア用テキストをコピーしました！📋✨");
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coffeeName || !flavorText) return;

        // NGワードチェック
        const foundNg = checkNgWords(flavorText + coffeeName);
        if (foundNg.length > 0) {
            setNgWarning(`「${foundNg[0]}」という言葉が入っているみたい...。ポジティブな言葉でシェアしてみませんか？☕️✨`);
            return;
        }
        setNgWarning(null);

        setIsSubmitting(true);
        try {
            // Firebase設定がない場合はデモモードとしてアラートを表示
            if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                console.warn("DEMO MODE: Post simulated.");
                await new Promise(resolve => setTimeout(resolve, 800)); // 送信中っぽく
                alert("【デモモード】投稿をシミュレートしました！実際に保存するにはFirebaseの設定が必要です。✨");
                // フォームリセット
                handleCloseModalAndReset();
                return;
            }

            // ニックネーム保存 (次回用にブラウザに記録)
            if (nickname) {
                localStorage.setItem("coffee_float_nickname", nickname);
            }

            const docData = {
                userId: userId || "anonymous",
                nickname: nickname || "名無しのコーヒー好き",
                coffeeName,
                location,
                flavorText,
                flavorStamp,
                isFavorite,
                aging,
                likes: 0,
                createdAt: serverTimestamp(),
            };
            await addDoc(collection(db, "posts"), docData);

            setLastSharedData(docData);
            setShowSuccess(true);

            // 成功演出後にシェアモーダルを表示
            setTimeout(() => {
                setShowSuccess(false);
                setShowShareModal(true);
            }, 2000); // 成功アニメーションの表示時間

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("投稿に失敗しちゃったみたい...");
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "2rem",
                    zIndex: 100,
                    width: "60px",
                    height: "60px",
                    borderRadius: "30px",
                    fontSize: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: "var(--accent-gold)",
                    color: "var(--bg-deep)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s",
                }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="投稿する"
            >
                {isOpen ? "×" : "☕"}
            </button>

            {isOpen && (
                <div
                    className="glass-panel"
                    style={{
                        position: "fixed",
                        bottom: "11rem",
                        right: "2rem",
                        width: "calc(100% - 4rem)",
                        maxWidth: "400px",
                        maxHeight: "calc(100dvh - 16rem)", // ヘッダーとの被りを防ぐ
                        overflowY: "auto",
                        zIndex: 99,
                        padding: "1.5rem",
                        borderRadius: "1.5rem",
                        color: "var(--text-main)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    }}
                >
                    <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem", color: "var(--accent-gold)" }}>今の気分をシェア ✨</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "0.8rem" }}>
                            <input
                                type="text"
                                placeholder="ニックネーム (任意)"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: "0.8rem" }}>
                            <input
                                type="text"
                                placeholder="コーヒー名 (必須)"
                                required
                                value={coffeeName}
                                onChange={(e) => setCoffeeName(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        {aging !== null && (
                            <div style={{ marginBottom: "0.8rem", textAlign: "right" }}>
                                <span style={{
                                    fontSize: "0.75rem",
                                    background: "rgba(198, 166, 100, 0.2)",
                                    color: "var(--accent-gold)",
                                    padding: "0.3rem 0.6rem",
                                    borderRadius: "1rem",
                                    border: "1px solid rgba(198, 166, 100, 0.3)"
                                }}>
                                    ⏳ エイジング: {aging}日目
                                </span>
                            </div>
                        )}
                        <div style={{ marginBottom: "0.8rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "0.3rem", scrollbarWidth: "none" }}>
                                {["自宅", "職場", ...recentLocations].map((loc, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setLocation(loc)}
                                        style={{
                                            flexShrink: 0,
                                            padding: "0.3rem 0.6rem",
                                            borderRadius: "0.5rem",
                                            fontSize: "0.7rem",
                                            background: location === loc ? "var(--accent-gold)" : "rgba(255,255,255,0.1)",
                                            color: location === loc ? "var(--bg-deep)" : "var(--text-main)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        {loc === "自宅" ? "🏠 自宅" : loc === "職場" ? "💼 職場" : `📍 ${loc}`}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="どこで飲んだ？ (任意)"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "0.8rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>お気に入りに追加 ❤️</span>
                            <button
                                type="button"
                                onClick={() => setIsFavorite(!isFavorite)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "1.8rem",
                                    cursor: "pointer",
                                    transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                    transform: isFavorite ? "scale(1.2)" : "scale(1)",
                                    filter: isFavorite ? "none" : "grayscale(100%) opacity(0.5)",
                                }}
                            >
                                ❤️
                            </button>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <p style={{ fontSize: "0.8rem", opacity: 0.8, marginBottom: "0.5rem" }}>味わいスタンプを添える 🏷️</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                                {STAMPS.map((s) => (
                                    <button
                                        key={s.label}
                                        type="button"
                                        onClick={() => setFlavorStamp(flavorStamp === s.label ? null : s.label)}
                                        style={{
                                            padding: "0.6rem 0.4rem",
                                            borderRadius: "0.6rem",
                                            border: "2px solid",
                                            borderColor: flavorStamp === s.label ? s.color : "rgba(255,255,255,0.1)",
                                            backgroundColor: flavorStamp === s.label ? `${s.color}22` : "rgba(255,255,255,0.05)",
                                            color: flavorStamp === s.label ? s.color : "var(--text-main)",
                                            fontSize: "0.75rem",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "0.3rem",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <span>{s.icon}</span>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <textarea
                                placeholder="味わいや感想を教えて... (必須)"
                                required
                                rows={3}
                                value={flavorText}
                                onChange={(e) => setFlavorText(e.target.value)}
                                style={{ ...inputStyle, resize: "none" }}
                            />
                        </div>
                        {ngWarning && (
                            <div style={{
                                color: "#ff8da1",
                                fontSize: "0.8rem",
                                marginBottom: "1rem",
                                padding: "0.5rem",
                                background: "rgba(255, 141, 161, 0.1)",
                                borderRadius: "0.5rem",
                                border: "1px solid rgba(255, 141, 161, 0.3)"
                            }}>
                                {ngWarning}
                            </div>
                        )}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            style={{
                                width: "100%",
                                padding: "0.8rem",
                                borderRadius: "0.8rem",
                                border: "none",
                                backgroundColor: showSuccess ? "#4CAF50" : "var(--accent-gold)",
                                color: showSuccess ? "white" : "var(--bg-deep)",
                                fontWeight: "bold",
                                cursor: "pointer",
                                opacity: isSubmitting && !showSuccess ? 0.7 : 1,
                                transition: "background-color 0.3s"
                            }}
                        >
                            {showSuccess ? "投稿完了！ ✨" : isSubmitting ? "送信中..." : "投稿する ✨"}
                        </motion.button>
                    </form>

                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "rgba(30, 20, 15, 0.95)",
                                    borderRadius: "1.5rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 10,
                                    backdropFilter: "blur(10px)"
                                }}
                            >
                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    style={{ fontSize: "4rem", marginBottom: "1rem" }}
                                >
                                    ☕️✨
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    style={{ fontWeight: "bold", color: "var(--accent-gold)" }}
                                >
                                    It's a Perfect Coffee!
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: 0.7 }}
                                >
                                    素敵なコーヒータイムを。
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
            {/* SNS Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 3000,
                            background: "rgba(0,0,0,0.85)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                            backdropFilter: isShutterMode ? "none" : "blur(10px)",
                            transition: "all 0.3s ease"
                        }}
                        onClick={() => {
                            if (isShutterMode) setIsShutterMode(false);
                        }}
                    >
                        {/* Insta-style Share Card */}
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{
                                width: "100%",
                                maxWidth: "320px",
                                aspectRatio: "9/16",
                                background: "linear-gradient(135deg, #1a0f0a 0%, #0d0604 100%)",
                                borderRadius: "32px",
                                border: isShutterMode ? "none" : "1px solid rgba(198, 166, 100, 0.3)",
                                padding: "48px 32px",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                boxShadow: isShutterMode ? "none" : "0 30px 60px rgba(0,0,0,0.8)"
                            }}
                        >
                            {/* Decorative Elements */}
                            <div style={{
                                position: "absolute",
                                top: "-20%",
                                left: "-20%",
                                width: "100%",
                                height: "60%",
                                background: "radial-gradient(circle, rgba(198, 166, 100, 0.1) 0%, transparent 70%)",
                                pointerEvents: "none"
                            }} />

                            <div style={{
                                width: "80px",
                                height: "80px",
                                background: "rgba(198, 166, 100, 0.1)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "3rem",
                                marginBottom: "2.5rem",
                                border: "1px solid rgba(198, 166, 100, 0.2)"
                            }}>
                                ☕️
                            </div>

                            <div style={{ fontSize: "0.8rem", color: "var(--accent-gold)", letterSpacing: "3px", marginBottom: "0.5rem", fontWeight: "bold", opacity: 0.6 }}>
                                COFFEE LOG
                            </div>

                            <h2 style={{ fontSize: "2rem", color: "white", marginBottom: "1rem", fontWeight: "bold", lineHeight: "1.2" }}>
                                {lastSharedData?.coffeeName}
                            </h2>

                            <div style={{ fontSize: "1rem", opacity: 0.7, marginBottom: "3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                📍 {lastSharedData?.location || "My Coffee Spot"}
                            </div>

                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "20px", width: "100%", marginBottom: "auto", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.8rem", color: "var(--accent-gold)" }}>
                                    {lastSharedData?.flavorStamp}
                                </div>
                                <p style={{ fontSize: "0.95rem", opacity: 0.8, lineHeight: "1.6", fontStyle: "italic" }}>
                                    "{lastSharedData?.flavorText}"
                                </p>
                            </div>

                            <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(198, 166, 100, 0.1)", width: "100%" }}>
                                <div style={{ fontSize: "0.8rem", color: "var(--accent-gold)", fontWeight: "bold", letterSpacing: "4px" }}>COFFEE FLOAT</div>
                                <div style={{ fontSize: "0.6rem", opacity: 0.3, marginTop: "0.6rem" }}>Moments of serenity, captured.</div>
                            </div>
                        </motion.div>

                        {/* Actions (Hidden in Shutter Mode) */}
                        <AnimatePresence>
                            {!isShutterMode && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    style={{ marginTop: "30px", width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "12px" }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsShutterMode(true);
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "16px",
                                            borderRadius: "14px",
                                            background: "white",
                                            border: "none",
                                            color: "#1e0f0a",
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px"
                                        }}
                                    >
                                        📸 シャッターチャンス
                                    </button>

                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const text = `${lastSharedData?.coffeeName} ☕️✨\n場所: ${lastSharedData?.location || "不明"}\n気分: ${lastSharedData?.flavorStamp}\n"${lastSharedData?.flavorText}"\n#CoffeeFloat #CoffeeLog`;
                                                copyToClipboard(text);
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background: "rgba(255,255,255,0.1)",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                color: "white",
                                                fontSize: "0.9rem",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            本文をコピー 📋
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: "My Coffee Moment",
                                                        text: `I just had a perfect cup of ${lastSharedData?.coffeeName}! ☕️✨\n#CoffeeFloat #CoffeeLog`,
                                                        url: window.location.origin
                                                    }).catch(console.error);
                                                }
                                            }}
                                            style={{
                                                padding: "14px",
                                                borderRadius: "14px",
                                                background: "rgba(255,255,255,0.1)",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                color: "white",
                                                fontSize: "1.2rem",
                                                cursor: "pointer"
                                            }}
                                        >
                                            🔗
                                        </button>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCloseModalAndReset();
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            background: "none",
                                            border: "none",
                                            color: "rgba(255,255,255,0.5)",
                                            fontSize: "0.9rem",
                                            cursor: "pointer",
                                            marginTop: "10px"
                                        }}
                                    >
                                        閉じる
                                    </button>

                                    <p style={{ textAlign: "center", fontSize: "0.75rem", opacity: 0.5 }}>
                                        ※シャッターボタンを押すとUIが消えます。<br />スクショを撮ったあと画面タップで戻ります。
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "0.8rem",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(0,0,0,0.2)",
    color: "var(--text-main)",
    outline: "none",
    fontFamily: "inherit",
    fontSize: "16px", // 16px以上にすることでiOSのフォーカス時ズームを防止
};
