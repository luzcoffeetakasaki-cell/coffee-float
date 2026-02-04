export interface Badge {
    id: string;
    name: string;
    icon: string;
    hint: string;
    description: string;
    condition: (data: { posts: any[]; beans: any[] }) => boolean;
}

export const BADGES: Badge[] = [
    {
        id: "ethiopia_master",
        name: "エチオピアの守護者",
        icon: "🇪🇹",
        hint: "ある特定の産地のコーヒーを20回嗜むと...",
        description: "エチオピア産のコーヒーを20回楽しんだ証。フルーティーな香りの探求者。",
        condition: ({ posts }) =>
            posts.filter(p => p.coffeeName.includes("エチオピア") || p.coffeeName.toLowerCase().includes("ethiopia")).length >= 20
    },
    {
        id: "frequent_visitor",
        name: "馴染みの常連さん",
        icon: "🏢",
        hint: "お気に入りのお店に10回通い詰めると...",
        description: "特定のお店に10回通った証。あなたも立派な常連さんです。",
        condition: ({ posts }) => {
            const locations = posts.map(p => p.location).filter(l => l && l !== "どこか");
            const counts: Record<string, number> = {};
            for (const loc of locations) {
                counts[loc] = (counts[loc] || 0) + 1;
                if (counts[loc] >= 10) return true;
            }
            return false;
        }
    },
    {
        id: "comment_lover",
        name: "語り部",
        icon: "✍️",
        hint: "30回の想いを言葉に綴ると...",
        description: "コメント付きの投稿を30回行った証。あなたの言葉がコーヒーを彩ります。",
        condition: ({ posts }) =>
            posts.filter(p => p.flavorText && p.flavorText.length > 5).length >= 30
    },
    {
        id: "bean_collector",
        name: "豆の収集家",
        icon: "🫘",
        hint: "10種類の豆をあなたのリストに加えると...",
        description: "豆リストに10種類のコーヒー豆を登録した証。コレクション精神の持ち主。",
        condition: ({ beans }) => beans.length >= 10
    },
    {
        id: "first_log",
        name: "始まりの記録者",
        icon: "📝",
        hint: "最初の一歩を記すと...",
        description: "初めてのコーヒーログを投稿した証。ここからマスターの旅が始まります。",
        condition: ({ posts }) => posts.length >= 1
    },
    {
        id: "favorite_hunter",
        name: "至福の探求者",
        icon: "❤️",
        hint: "「お気に入り」を5つ見つけ出すと...",
        description: "お気に入りの投稿を5つ付けた証。あなたは自分の好みをよく知っています。",
        condition: ({ posts }) => posts.filter(p => p.isFavorite).length >= 5
    }
];
