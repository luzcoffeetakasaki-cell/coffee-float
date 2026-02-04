"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentUserId, isGuestUserId, getStoredDeviceId } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { writeBatch, getDocs } from "firebase/firestore";

interface Bean {
    id: string;
    name: string;
    shopName?: string; // 購入店舗
    origin?: string; // 生産地
    process?: string; // 精製方法
    roastDate: string; // 焙煎日
    notes?: string; // 備考
    createdAt: Timestamp;
}

export default function BeanList() {
    const [beans, setBeans] = useState<Bean[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [name, setName] = useState("");
    const [shopName, setShopName] = useState("");
    const [origin, setOrigin] = useState("");
    const [process, setProcess] = useState("");
    const [roastDate, setRoastDate] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const initUser = async () => {
            try {
                const id = await getCurrentUserId();
                setUserId(id);

                const storedGuestId = getStoredDeviceId();
                if (id && !isGuestUserId(id) && storedGuestId && isGuestUserId(storedGuestId)) {
                    migrateGuestData(storedGuestId, id);
                }
            } catch (e) {
                console.error("User init failed in BeanList", e);
                setLoading(false);
            }
        };
        initUser();
    }, []);

    const migrateGuestData = async (guestId: string, lineId: string) => {
        try {
            const q = query(
                collection(db, "beans"),
                where("userId", "==", guestId)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) return;

            const batch = writeBatch(db);
            snapshot.docs.forEach((docSnap) => {
                batch.update(docSnap.ref, { userId: lineId });
            });
            await batch.commit();
        } catch (error) {
            console.error("Migration failed", error);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, "beans"),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newBeans = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Bean[];

            newBeans.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

            setBeans(newBeans);
            setLoading(false);
        }, (error) => {
            console.error("Bean listener failed:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !name || !roastDate) return;

        try {
            await addDoc(collection(db, "beans"), {
                userId,
                name,
                shopName: shopName || "",
                origin: origin || "",
                process: process || "",
                roastDate,
                notes: notes || "",
                createdAt: Timestamp.now(),
            });
            setIsAdding(false);
            setName("");
            setShopName("");
            setOrigin("");
            setProcess("");
            setRoastDate("");
            setNotes("");
        } catch (error) {
            console.error("Error adding bean:", error);
            alert("登録に失敗しました💦");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("この豆を削除しますか？")) return;
        try {
            await deleteDoc(doc(db, "beans", id));
        } catch (error) {
            console.error("Error deleting bean:", error);
        }
    };

    const handlePostFromBean = (bean: Bean) => {
        // カスタムイベントを発火して、PostFormにデータを渡す
        const event = new CustomEvent("coffee-float:open-post", {
            detail: {
                coffeeName: bean.name,
                location: bean.shopName || "",
                roastDate: bean.roastDate
            }
        });
        window.dispatchEvent(event);
    };

    const calculateDaysSinceRoast = (dateStr: string) => {
        const roast = new Date(dateStr);
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const roastDateOnly = new Date(roast.getFullYear(), roast.getMonth(), roast.getDate());
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const diff = Math.round((todayDateOnly.getTime() - roastDateOnly.getTime()) / oneDay);
        return diff;
    };

    return (
        <div style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            padding: "6rem 1.5rem 8rem 1.5rem",
            color: "var(--text-main)",
        }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)" }}>Beans List 🫘</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        background: "var(--accent-gold)",
                        color: "#1e0f0a",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(198, 166, 100, 0.4)",
                        zIndex: 10
                    }}
                >
                    {isAdding ? "×" : "＋"}
                </button>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleSubmit}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            padding: "1.5rem",
                            borderRadius: "1rem",
                            marginBottom: "2rem",
                            border: "1px solid var(--glass-border)",
                            overflow: "hidden"
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem", opacity: 0.8 }}>コーヒー名 *</label>
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="例：エチオピア イルガチェフェ"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem", opacity: 0.8 }}>買ったお店</label>
                                <input
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    placeholder="例：Luz Coffee"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem", opacity: 0.8 }}>生産地</label>
                                    <input
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                        placeholder="例：エチオピア"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem", opacity: 0.8 }}>精製方法</label>
                                    <input
                                        value={process}
                                        onChange={(e) => setProcess(e.target.value)}
                                        placeholder="例：ウォッシュド"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem", opacity: 0.8 }}>焙煎日 *</label>
                                <input
                                    required
                                    type="date"
                                    value={roastDate}
                                    onChange={(e) => setRoastDate(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem", opacity: 0.8 }}>備考 (メモ)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="例：ロースト深め、ミルクに合う"
                                    style={{ ...inputStyle, minHeight: "80px", resize: "none", fontFamily: "inherit" }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    marginTop: "1rem",
                                    padding: "0.8rem",
                                    borderRadius: "0.5rem",
                                    border: "none",
                                    background: "var(--accent-gold)",
                                    color: "#1e0f0a",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                登録する 📝
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {loading ? (
                <div style={{ textAlign: "center", padding: "3rem", opacity: 0.6 }}>読み込み中...🫘</div>
            ) : beans.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", opacity: 0.6 }}>
                    <p>まだ豆が登録されていません。</p>
                    <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>右上の＋ボタンから追加してみましょう！</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {beans.map((bean) => {
                        const daysSince = calculateDaysSinceRoast(bean.roastDate);
                        return (
                            <motion.div
                                key={bean.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: "rgba(30, 20, 15, 0.6)",
                                    padding: "1.2rem",
                                    borderRadius: "1rem",
                                    border: "1px solid rgba(198, 166, 100, 0.2)",
                                    position: "relative"
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#f0e6d2", paddingRight: "2rem" }}>
                                        {bean.name}
                                    </h3>
                                    <button
                                        onClick={() => handleDelete(bean.id)}
                                        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                                    >
                                        🗑️
                                    </button>
                                </div>

                                {bean.shopName && (
                                    <div style={{ fontSize: "0.85rem", color: "var(--accent-gold)", marginBottom: "0.5rem", opacity: 0.9 }}>
                                        🏪 {bean.shopName}
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "0.8rem", fontSize: "0.75rem", opacity: 0.7, marginBottom: "0.8rem" }}>
                                    {bean.origin && <span>📍 {bean.origin}</span>}
                                    {bean.process && <span>⚙️ {bean.process}</span>}
                                </div>

                                <div style={{
                                    background: "rgba(0,0,0,0.3)",
                                    padding: "0.6rem 1rem",
                                    borderRadius: "0.5rem",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                                        焙煎日: {bean.roastDate}
                                    </div>
                                    <div style={{
                                        fontWeight: "bold",
                                        fontSize: "0.85rem",
                                        color: daysSince < 14 ? "#4CAF50" : daysSince < 30 ? "#FFC107" : "#FF5722"
                                    }}>
                                        {daysSince}日経過
                                    </div>
                                </div>

                                {bean.notes && (
                                    <div style={{
                                        marginTop: "0.8rem",
                                        padding: "0.8rem",
                                        background: "rgba(255,255,255,0.03)",
                                        borderRadius: "0.6rem",
                                        fontSize: "0.8rem",
                                        lineHeight: "1.5",
                                        borderLeft: "3px solid var(--accent-gold)",
                                        opacity: 0.9
                                    }}>
                                        {bean.notes}
                                    </div>
                                )}

                                <button
                                    onClick={() => handlePostFromBean(bean)}
                                    style={{
                                        width: "100%",
                                        marginTop: "1rem",
                                        padding: "0.6rem",
                                        borderRadius: "0.5rem",
                                        border: "1px solid rgba(198, 166, 100, 0.3)",
                                        background: "rgba(198, 166, 100, 0.1)",
                                        color: "var(--accent-gold)",
                                        fontSize: "0.8rem",
                                        fontWeight: "bold",
                                        cursor: "pointer"
                                    }}
                                >
                                    ✍️ 感想をシェアする
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.3)",
    color: "white",
    fontSize: "0.9rem"
};
