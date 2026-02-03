import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const STAMPS: Record<string, { color: string; icon: string }> = {
    SWEET: { color: "#FF8DA1", icon: "🍬" },
    JUICY: { color: "#FFB347", icon: "🍊" },
    BITTER: { color: "#A67C52", icon: "☕" },
    FLORAL: { color: "#B39DDB", icon: "🌸" },
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // クエリパラメータの取得
        // ?title=CoffeeName&stamp=SWEET&flavor=Description
        const title = searchParams.get('title')?.slice(0, 100) || 'Coffee Float';
        const stampKey = searchParams.get('stamp');
        const stamp = stampKey && STAMPS[stampKey] ? { label: stampKey, ...STAMPS[stampKey] } : null;

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1a1410', // var(--bg-deep)
                        color: 'white',
                        fontFamily: 'sans-serif',
                        position: 'relative',
                    }}
                >
                    {/* 背景装飾 */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 168, 77, 0.1) 0%, transparent 60%)',
                        }}
                    />

                    {/* スタンプ表示 */}
                    {stamp && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                fontSize: 60,
                                color: stamp.color,
                                marginBottom: 40,
                                padding: '10px 40px',
                                border: `4px solid ${stamp.color}`,
                                borderRadius: 50,
                                backgroundColor: 'rgba(255,255,255,0.05)',
                            }}
                        >
                            <span>{stamp.icon}</span>
                            <span>{stamp.label}</span>
                        </div>
                    )}

                    {/* タイトル */}
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            maxWidth: '90%',
                            lineHeight: 1.2,
                            color: '#d4a84d', // var(--accent-gold)
                            marginBottom: 20,
                            textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        }}
                    >
                        {title}
                    </div>

                    {/* アプリ名 */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 40,
                            fontSize: 24,
                            opacity: 0.6,
                        }}
                    >
                        Coffee Float ☕️
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
