"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { usePWA } from "@/hooks/usePWA";

export default function LineOpenBanner() {
    const isPWA = usePWA();
    const [showBanner, setShowBanner] = useState(false);
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

    useEffect(() => {
        // LIFF初期化待ちなどを考慮し、少し遅延させるか、単純に条件チェック
        // liff.isInClient() は初期化前でも false なので、初期化完了を待つのが理想だが
        // 簡易的に「LINE外」かつ「PWAでない」場合に表示
        const checkEnvironment = () => {
            // クライアントサイドでのみ実行
            if (typeof window === "undefined") return;

            const isLine = navigator.userAgent.includes("Line");
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // モバイルかつ、LINEアプリ外かつ、PWAでない場合に提案
            if (isMobile && !isLine && !isPWA) {
                setShowBanner(true);
            }
        };

        checkEnvironment();
    }, [isPWA]);

    if (!showBanner || !liffId) return null;

    return (
        <a
            href={`https://liff.line.me/${liffId}`}
            style={{
                position: "fixed",
                bottom: "1.5rem",
                right: "1.5rem",
                zIndex: 999,
                background: "#06C755",
                color: "white",
                padding: "0.8rem 1.2rem",
                borderRadius: "2rem",
                boxShadow: "0 4px 15px rgba(6, 199, 85, 0.4)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                animation: "pulse 2s infinite"
            }}
        >
            <span style={{ fontSize: "1.2rem" }}>💬</span> LINEアプリで開く
        </a>
    );
}
