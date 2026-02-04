"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CafeSearch() {
    const [searchQuery, setSearchQuery] = useState("");

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
