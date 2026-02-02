"use client";

import { useEffect, ReactNode } from "react";
import { initLiff } from "@/lib/liff";

export default function LiffProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (liffId) {
            initLiff(liffId);
        } else {
            console.warn("LIFF ID is missing. LIFF features will be disabled.");
        }
    }, []);

    return <>{children}</>;
}
