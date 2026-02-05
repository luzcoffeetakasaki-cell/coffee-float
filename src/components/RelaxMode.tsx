"use client";

import { useRelax, BGM_LIST } from "@/context/RelaxContext";
import { motion } from "framer-motion";

export default function RelaxMode() {
    const {
        isPlayingBgm, toggleBgm, bgmVolume, setBgmVolume,
        isPlayingRain, toggleRain, rainVolume, setRainVolume,
        isPlayingFire, toggleFire, fireVolume, setFireVolume,
        isPlayingCafe, toggleCafe, cafeVolume, setCafeVolume,
        selectedBgmId, setSelectedBgmId
    } = useRelax();

    const mixerItems = [
        { id: 'bgm', label: 'Lo-Fi BGM', icon: '🎵', isPlaying: isPlayingBgm, toggle: toggleBgm, volume: bgmVolume, setVolume: setBgmVolume },
        { id: 'rain', label: 'Rainy', icon: '☔', isPlaying: isPlayingRain, toggle: toggleRain, volume: rainVolume, setVolume: setRainVolume },
        { id: 'fire', label: 'Fireplace', icon: '🔥', isPlaying: isPlayingFire, toggle: toggleFire, volume: fireVolume, setVolume: setFireVolume },
        { id: 'cafe', label: 'Cafe Noise', icon: '☕', isPlaying: isPlayingCafe, toggle: toggleCafe, volume: cafeVolume, setVolume: setCafeVolume },
    ];

    return (
        <div style={{
            width: "100%",
            height: "100%",
            padding: "6rem 1.5rem 8rem 1.5rem",
            color: "var(--text-main)",
            overflowY: "auto",
            background: "linear-gradient(to bottom, #0d0604, #1a0f0a)", // Deep background
        }}>
            <header style={{ marginBottom: "2rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "0.5rem" }}>Midnight Cafe 🕯️</h2>
                <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                    音を重ねて、あなただけの時間を。
                </p>
            </header>

            {/* Candle Animation */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
                <motion.div
                    animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: "relative",
                        width: "60px",
                        height: "100px",
                        background: "linear-gradient(to top, rgba(255, 100, 0, 0.1), transparent)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end"
                    }}
                >
                    <div style={{ width: "20px", height: "40px", background: "#f5e1a4", borderRadius: "50% 50% 20% 20%", boxShadow: "0 0 20px #ff9900", animation: "flicker 0.1s infinite alternate" }} />
                    {/* Simple flickering effect using style tag for keyframes */}
                    <style jsx>{`
                        @keyframes flicker {
                            0% { transform: scale(1); opacity: 0.9; }
                            100% { transform: scale(1.05); opacity: 1; }
                        }
                    `}</style>
                </motion.div>
            </div>

            {/* BGM Selector */}
            <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--accent-gold)", marginBottom: "0.8rem", paddingLeft: "0.5rem", fontWeight: "bold" }}>SELECT BGM</p>
                <div style={{
                    display: "flex",
                    gap: "0.8rem",
                    overflowX: "auto",
                    padding: "0.5rem",
                    paddingBottom: "1rem",
                    scrollbarWidth: "none", // Hide scrollbar for cleaner look
                }}>
                    <style jsx>{`
                        div::-webkit-scrollbar { display: none; }
                    `}</style>
                    {BGM_LIST.map((bgm) => (
                        <motion.button
                            key={bgm.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedBgmId(bgm.id)}
                            style={{
                                flexShrink: 0,
                                background: selectedBgmId === bgm.id ? "var(--accent-gold)" : "rgba(255,255,255,0.05)",
                                color: selectedBgmId === bgm.id ? "#1e0f0a" : "var(--text-main)",
                                border: selectedBgmId === bgm.id ? "1px solid var(--accent-gold)" : "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "1rem",
                                padding: "0.6rem 1.2rem",
                                fontSize: "0.85rem",
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                fontWeight: selectedBgmId === bgm.id ? "bold" : "normal",
                                boxShadow: selectedBgmId === bgm.id ? "0 0 15px rgba(198, 166, 100, 0.3)" : "none"
                            }}
                        >
                            {bgm.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
                {mixerItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: item.isPlaying ? "rgba(198, 166, 100, 0.15)" : "rgba(255,255,255,0.05)",
                            borderRadius: "1rem",
                            padding: "1rem",
                            border: item.isPlaying ? "1px solid rgba(198, 166, 100, 0.3)" : "1px solid rgba(255,255,255,0.1)",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                <div style={{
                                    fontSize: "1.5rem",
                                    opacity: item.isPlaying ? 1 : 0.5,
                                    filter: item.isPlaying ? "none" : "grayscale(100%)"
                                }}>
                                    {item.icon}
                                </div>
                                <span style={{ fontWeight: "bold", opacity: item.isPlaying ? 1 : 0.7 }}>
                                    {item.label}
                                </span>
                            </div>
                            <button
                                onClick={item.toggle}
                                style={{
                                    background: item.isPlaying ? "var(--accent-gold)" : "rgba(255,255,255,0.1)",
                                    color: item.isPlaying ? "#1e0f0a" : "white",
                                    border: "none",
                                    borderRadius: "1.5rem",
                                    padding: "0.4rem 1rem",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                {item.isPlaying ? "ON" : "OFF"}
                            </button>
                        </div>
                        {item.isPlaying && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                <span style={{ fontSize: "1rem", opacity: 0.5 }}>🔈</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={item.volume}
                                    onChange={(e) => item.setVolume(parseFloat(e.target.value))}
                                    style={{
                                        flex: 1,
                                        accentColor: "var(--accent-gold)",
                                        height: "4px",
                                        cursor: "pointer"
                                    }}
                                />
                                <span style={{ fontSize: "1rem", opacity: 0.5 }}>🔊</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
