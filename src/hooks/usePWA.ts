import { useState, useEffect } from "react";

export const usePWA = () => {
    const [isPWA, setIsPWA] = useState(false);

    useEffect(() => {
        const checkPWA = () => {
            const isStandalone = window.matchMedia("(display-mode: standalone)").matches
                || (window.navigator as any).standalone
                || document.referrer.includes("android-app://");

            setIsPWA(!!isStandalone);
        };

        checkPWA();
        window.addEventListener("resize", checkPWA); // 画面サイズ変更時なども念のためチェック
        return () => window.removeEventListener("resize", checkPWA);
    }, []);

    return isPWA;
};
