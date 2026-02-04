"use client";

import { useEffect, ReactNode } from "react";
import { initLiff } from "@/lib/liff";

export default function LiffProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        // initLiff now handles empty IDs safely to resolve the liffReady promise
        initLiff(liffId || "");
    }, []);

    return <>{children}</>;
}
