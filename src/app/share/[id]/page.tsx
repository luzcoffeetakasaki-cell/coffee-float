
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
    params: Promise<{ id: string }>;
};

// Firestoreからデータを取得する関数
async function getPost(id: string) {
    try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
    } catch (e) {
        console.error("Error fetching post:", e);
    }
    return null;
}

// 動的メタデータの生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        return {
            title: "Coffee Float",
            description: "コーヒーの思い出をシェアしよう。",
        };
    }

    const { coffeeName, flavorText, flavorStamp } = post;
    const title = coffeeName || "Coffee Float";

    // OGP画像URLの構築
    const ogUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || "https://coffee-float-x8lg.vercel.app"}/api/og`);
    ogUrl.searchParams.set("title", title);
    if (flavorStamp) ogUrl.searchParams.set("stamp", flavorStamp);

    return {
        title: `${title} | Coffee Float`,
        description: flavorText,
        openGraph: {
            title: `${title} | Coffee Float`,
            description: flavorText,
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Coffee Float`,
            description: flavorText,
            images: [ogUrl.toString()],
        },
    };
}

export default async function SharePage({ params }: Props) {
    const { id } = await params;
    const post = await getPost(id);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)",
            color: "#fff",
            fontFamily: "sans-serif",
            padding: "20px",
            textAlign: "center"
        }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#d4a84d" }}>Coffee Float ☕️</h1>

            {post ? (
                <div style={{ marginBottom: "2rem" }}>
                    <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{post.coffeeName}</p>
                    <p style={{ opacity: 0.8 }}>{post.flavorText}</p>
                </div>
            ) : (
                <p>投稿が見つかりませんでした。</p>
            )}

            <Link
                href="/"
                style={{
                    padding: "1rem 2rem",
                    backgroundColor: "#d4a84d",
                    color: "#090A0F",
                    borderRadius: "2rem",
                    textDecoration: "none",
                    fontWeight: "bold",
                    marginTop: "1rem"
                }}
            >
                アプリを開く 🚀
            </Link>
        </div>
    );
}
