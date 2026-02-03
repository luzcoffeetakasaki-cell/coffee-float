"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getLiffProfile } from "@/lib/liff";
import { checkNgWords } from "@/lib/filter";

export default function PostForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [nickname, setNickname] = useState("");
    const [coffeeName, setCoffeeName] = useState("");
    const [location, setLocation] = useState("");
    const [flavorText, setFlavorText] = useState("");
    const [flavorStamp, setFlavorStamp] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ngWarning, setNgWarning] = useState<string | null>(null);

    const STAMPS = [
        { label: "SWEET", color: "#FF8DA1", icon: "🍬" },
        { label: "JUICY", color: "#FFB347", icon: "🍊" },
        { label: "BITTER", color: "#A67C52", icon: "☕" },
        { label: "FLORAL", color: "#B39DDB", icon: "🌸" },
    ];

    // ニックネームの読み込み (localStorage) & LIFF userId の取得
    useEffect(() => {
        const savedNickname = localStorage.getItem("coffee_float_nickname");
        if (savedNickname) {
            setNickname(savedNickname);
        }

        const fetchProfile = async () => {
            const profile = await getLiffProfile();
            if (profile?.userId) {
                setUserId(profile.userId);
            }
        };
        fetchProfile();
    }, []);

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
                setCoffeeName("");
                setLocation("");
                setFlavorText("");
                setFlavorStamp(null);
                setIsOpen(false);
                return;
            }

            // ニックネーム保存 (次回用にブラウザに記録)
            if (nickname) {
                localStorage.setItem("coffee_float_nickname", nickname);
            }

            await addDoc(collection(db, "posts"), {
                userId: userId || "anonymous",
                nickname: nickname || "名無しのコーヒー好き",
                coffeeName,
                location,
                flavorText,
                flavorStamp,
                likes: 0,
                createdAt: serverTimestamp(),
            });
            // フォームをリセット
            setCoffeeName("");
            setLocation("");
            setFlavorText("");
            setFlavorStamp(null);
            setIsOpen(false);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("投稿に失敗しちゃったみたい...");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                style={{
                    position: "fixed",
                    bottom: "2rem",
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
                        bottom: "6rem",
                        right: "2rem",
                        width: "calc(100% - 4rem)",
                        maxWidth: "400px",
                        zIndex: 99,
                        padding: "1.5rem",
                        borderRadius: "1.5rem",
                        color: "var(--text-main)",
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
                        <div style={{ marginBottom: "0.8rem" }}>
                            <input
                                type="text"
                                placeholder="場所 (任意)"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={inputStyle}
                            />
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
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: "100%",
                                padding: "0.8rem",
                                borderRadius: "0.8rem",
                                border: "none",
                                backgroundColor: "var(--accent-gold)",
                                color: "var(--bg-deep)",
                                fontWeight: "bold",
                                cursor: "pointer",
                                opacity: isSubmitting ? 0.7 : 1,
                            }}
                        >
                            {isSubmitting ? "送信中..." : "投稿する ✨"}
                        </button>
                    </form>
                </div>
            )}
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
