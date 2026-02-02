"use client";

interface Post {
    id: string;
    nickname: string;
    coffeeName: string;
    location: string;
    flavorText: string;
    likes: number;
    createdAt: any; // Firebase Timestamp
}

interface DetailModalProps {
    post: Post | null;
    onClose: () => void;
}

export default function DetailModal({ post, onClose }: DetailModalProps) {
    if (!post) return null;

    const dateStr = post.createdAt?.toDate?.()
        ? post.createdAt.toDate().toLocaleString("ja-JP")
        : "たった今";

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(6px)",
            }}
            onClick={onClose}
        >
            <div
                className="glass-panel"
                style={{
                    width: "90%",
                    maxWidth: "450px",
                    padding: "2rem",
                    borderRadius: "2rem",
                    color: "var(--text-main)",
                    position: "relative",
                    animation: "drift 20s infinite ease-in-out",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1.5rem",
                        background: "none",
                        border: "none",
                        color: "var(--accent-gold)",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                    }}
                    onClick={onClose}
                >
                    ×
                </button>

                <div style={{ marginBottom: "0.5rem", opacity: 0.7, fontSize: "0.8rem" }}>
                    {dateStr} @ {post.location || "どこか"}
                </div>
                <h2 style={{ fontSize: "1.5rem", color: "var(--accent-gold)", marginBottom: "1rem" }}>
                    {post.coffeeName}
                </h2>

                <div style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.6",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "1rem",
                    marginBottom: "1.5rem"
                }}>
                    {post.flavorText}
                </div>

                <div style={{ textAlign: "right", opacity: 0.8 }}>
                    — {post.nickname}
                </div>
            </div>
        </div>
    );
}
