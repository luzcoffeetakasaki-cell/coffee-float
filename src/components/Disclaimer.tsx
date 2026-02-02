"use client";

import { useEffect, useState } from "react";

export default function Disclaimer() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem("coffee_float_disclaimer");
        if (!hasSeen) {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("coffee_float_disclaimer", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div
                className="glass-panel"
                style={{
                    width: "90%",
                    maxWidth: "400px",
                    padding: "2rem",
                    borderRadius: "2rem",
                    textAlign: "center",
                    color: "var(--text-main)",
                }}
            >
                <h2 style={{ color: "var(--accent-gold)", marginBottom: "1.5rem" }}>
                    Coffee Float へようこそ ☕✨
                </h2>
                <div style={{ textAlign: "left", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "2rem" }}>
                    <p>このアプリは「今、この瞬間の感動」をシェアする場所です。</p>
                    <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
                        <li>コーヒーは嗜好品です。ポジティブな感想を楽しみましょう。</li>
                        <li>批判的なコメントはお控えください。</li>
                        <li>投稿は一定期間で消える儚いコンセプトです。</li>
                    </ul>
                </div>
                <button
                    onClick={handleClose}
                    style={{
                        padding: "0.8rem 2rem",
                        borderRadius: "1rem",
                        border: "none",
                        backgroundColor: "var(--accent-gold)",
                        color: "var(--bg-deep)",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    わかった！✨
                </button>
            </div>
        </div>
    );
}
