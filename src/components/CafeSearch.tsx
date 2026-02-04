"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { getCurrentUserId } from "@/lib/auth";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

export default function CafeSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<{ id: string; name: string; note: string }[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [newName, setNewName] = useState("");
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const id = await getCurrentUserId();
            setUserId(id);
        };
        init();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, "favoriteCafes"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const favs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as { id: string; name: string; note: string }[];
            setFavorites(favs);
            setLoading(false);
        }, (error) => {
            console.error("Favorite cafes listener error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery + " コーヒーショップ カフェ")}`;
        window.open(url, "_blank");
    };

    const quickLinks = [
        { label: "近くの焙煎所", query: "自家焙煎 コーヒー豆販売", icon: "🫘" },
        { label: "落ち着くカフェ", query: "落ち着く カフェ 静か", icon: "🛋️" },
        { label: "今やってるお店", query: "カフェ 営業中", icon: "🕙" },
        { label: "Wi-Fiあり", query: "カフェ Wi-Fi 電源", icon: "💻" },
    ];

    const handleQuickSearch = (query: string) => {
        const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
        window.open(url, "_blank");
    };

    const handleAddFavorite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !newName.trim()) return;

        try {
            await addDoc(collection(db, "favoriteCafes"), {
                userId,
                name: newName,
                note: newNote,
                createdAt: serverTimestamp()
            });
            setNewName("");
            setNewNote("");
            setIsRegistering(false);
        } catch (error) {
            console.error("Failed to add favorite", error);
            alert("お気に入りの保存に失敗しました。時間をおいて再度お試しください。");
        }
    };

    const handleDeleteFavorite = async (id: string) => {
        if (!window.confirm("お気に入りから削除しますか？")) return;
        try {
            await deleteDoc(doc(db, "favoriteCafes", id));
        } catch (error) {
            console.error("Failed to delete favorite", error);
        }
    };

    return (
        <div style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            padding: "6rem 1.5rem 8rem 1.5rem",
            color: "var(--text-main)",
        }}>
            <header style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "0.5rem" }}>Cafe Explorer 🔍</h2>
                <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>次の一杯に出会う旅へ。</p>
            </header>

            <section style={{ marginBottom: "3rem" }}>
                <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: "1.5rem" }}>
                    <input
                        type="text"
                        placeholder="場所や店名で探す..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "1rem 1.2rem",
                            paddingRight: "3.5rem",
                            borderRadius: "1rem",
                            border: "1px solid var(--glass-border)",
                            background: "rgba(255,255,255,0.05)",
                            color: "white",
                            fontSize: "1rem",
                            outline: "none",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            position: "absolute",
                            right: "0.8rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "var(--accent-gold)",
                            border: "none",
                            borderRadius: "0.6rem",
                            width: "2.4rem",
                            height: "2.4rem",
                            cursor: "pointer",
                            fontSize: "1.2rem"
                        }}
                    >
                        🔍
                    </button>
                </form>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {quickLinks.map((link, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickSearch(link.query)}
                            style={{
                                padding: "1.2rem",
                                borderRadius: "1.2rem",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid var(--glass-border)",
                                color: "white",
                                textAlign: "left",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem"
                            }}
                        >
                            <span style={{ fontSize: "1.5rem" }}>{link.icon}</span>
                            <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{link.label}</span>
                        </motion.button>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1rem", color: "var(--accent-gold)" }}>My Favorite Cafes ❤️</h3>
                    <button
                        onClick={() => setIsRegistering(true)}
                        style={{
                            background: "rgba(198, 166, 100, 0.2)",
                            border: "1px solid var(--accent-gold)",
                            color: "var(--accent-gold)",
                            borderRadius: "0.5rem",
                            padding: "0.2rem 0.6rem",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                        }}
                    >
                        + 追加
                    </button>
                </div>

                <AnimatePresence>
                    {isRegistering && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: "hidden", marginBottom: "1.5rem" }}
                        >
                            <form onSubmit={handleAddFavorite} style={{ background: "rgba(255,255,255,0.05)", padding: "1.2rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                                <input
                                    placeholder="店名"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    style={{ width: "100%", padding: "0.8rem", borderRadius: "0.6rem", background: "rgba(0,0,0,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.8rem", outline: "none" }}
                                    required
                                />
                                <input
                                    placeholder="メモ (例: ラテが絶品)"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    style={{ width: "100%", padding: "0.8rem", borderRadius: "0.6rem", background: "rgba(0,0,0,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.8rem", outline: "none" }}
                                />
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "0.6rem", background: "var(--accent-gold)", border: "none", fontWeight: "bold", cursor: "pointer" }}>保存する</button>
                                    <button type="button" onClick={() => setIsRegistering(false)} style={{ padding: "0.6rem 1rem", borderRadius: "0.6rem", background: "rgba(255,255,255,0.1)", border: "none", color: "white", cursor: "pointer" }}>キャンセル</button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <p style={{ fontSize: "0.8rem", textAlign: "center", opacity: 0.5 }}>読み込み中...</p>
                ) : favorites.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: "1.2rem", border: "1px dashed rgba(255,255,255,0.1)" }}>
                        <p style={{ fontSize: "0.85rem", opacity: 0.5 }}>お気に入りのお店を登録して<br />自分だけのカフェリストを作ろう！</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        {favorites.map((fav) => (
                            <motion.div
                                key={fav.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: "rgba(255,255,255,0.05)",
                                    padding: "1rem",
                                    borderRadius: "1rem",
                                    border: "1px solid rgba(255,255,255,0.05)"
                                }}
                            >
                                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => handleQuickSearch(fav.name)}>
                                    <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "0.2rem" }}>📍 {fav.name}</div>
                                    {fav.note && <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>{fav.note}</div>}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFavorite(fav.id);
                                    }}
                                    style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", padding: "0.5rem", opacity: 0.4 }}
                                >
                                    🗑️
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <section className="glass-panel" style={{ padding: "1.5rem", borderRadius: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>💡 探す時のヒント</h3>
                <ul style={{ fontSize: "0.85rem", opacity: 0.8, paddingLeft: "1.2rem", lineHeight: "1.8" }}>
                    <li>「中煎り」や「浅煎り」など、好みの焙煎度で検索してみましょう。</li>
                    <li>「駐車場あり」を追加すると、ドライブ中も安心です。</li>
                    <li>見つけたお店での体験は、ぜひ「Log」タブで記録してくださいね！</li>
                </ul>
            </section>
        </div>
    );
}
