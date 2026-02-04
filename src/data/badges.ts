import { Timestamp } from "firebase/firestore";

export interface Badge {
    id: string;
    name: string;
    icon: string;
    hint: string; // ロック時のヒント
    description: string; // 獲得後の説明
    condition: (data: { posts: any[]; beans: any[] }) => boolean;
    secret?: boolean; // 完全シークレット（ヒントも隠すなど）
}

// ----------------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------------

const getDates = (posts: any[]) => {
    return posts.map(p => {
        // Timestamp or Date handling
        const date = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
        return date;
    }).sort((a, b) => a.getTime() - b.getTime());
};

const getStreak = (posts: any[]) => {
    if (posts.length === 0) return 0;
    const dates = getDates(posts);

    // 日付のみの文字列セットを作成してユニーク化
    const uniqueDays = Array.from(new Set(dates.map(d => d.toDateString()))).map(d => new Date(d));

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
        const prev = uniqueDays[i - 1];
        const curr = uniqueDays[i];
        const diffIds = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

        if (Math.round(diffIds) === 1) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        if (currentStreak > maxStreak) maxStreak = currentStreak;
    }
    return maxStreak;
};

const countByCondition = (posts: any[], predicate: (p: any) => boolean) => {
    return posts.filter(predicate).length;
};

const hasKeyword = (text: string, keywords: string[]) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return keywords.some(k => lower.includes(k.toLowerCase()));
};

// ----------------------------------------------------------------------------
// Badges Definitions
// ----------------------------------------------------------------------------

export const BADGES: Badge[] = [
    // ========================================================================
    // 🔰 今後の一歩 (Milestones)
    // ========================================================================
    {
        id: "milestone_1",
        name: "最初の一杯",
        icon: "☕️",
        hint: "まずは一杯、記録してみよう",
        description: "記念すべき最初のコーヒーログ。ここから旅が始まる。",
        condition: ({ posts }) => posts.length >= 1
    },
    {
        id: "milestone_5",
        name: "コーヒー好き",
        icon: "🥉",
        hint: "5回の記録を達成する",
        description: "5杯の記録達成。コーヒーが日常の一部になってきた証。",
        condition: ({ posts }) => posts.length >= 5
    },
    {
        id: "milestone_10",
        name: "習慣の始まり",
        icon: "🥈",
        hint: "10回の記録を達成する",
        description: "10杯の記録達成。もう立派な習慣だね！",
        condition: ({ posts }) => posts.length >= 10
    },
    {
        id: "milestone_30",
        name: "デイリーバリスタ",
        icon: "🥇",
        hint: "30回の記録を達成する",
        description: "30杯の記録達成。1ヶ月毎日飲んだくらいの量！すごい！",
        condition: ({ posts }) => posts.length >= 30
    },
    {
        id: "milestone_50",
        name: "コーヒーマニア",
        icon: "🎖️",
        hint: "50回の記録を達成する",
        description: "50杯達成。もはやコーヒーなしの人生なんて考えられない？",
        condition: ({ posts }) => posts.length >= 50
    },
    {
        id: "milestone_100",
        name: "レジェンド",
        icon: "👑",
        hint: "100回の記録を達成する",
        description: "100杯達成！あなたは真のコーヒーレジェンドです。",
        condition: ({ posts }) => posts.length >= 100
    },
    {
        id: "milestone_200",
        name: "神の舌を持つ者",
        icon: "🧞‍♂️",
        hint: "200回の記録を達成する",
        description: "200杯達成。その舌はあらゆる味の違いを見分けるという…。",
        condition: ({ posts }) => posts.length >= 200
    },
    {
        id: "milestone_365",
        name: "365日の奇跡",
        icon: "📅",
        hint: "365回の記録を達成する",
        description: "365杯達成。1年分のコーヒー愛がここに詰まっている。",
        condition: ({ posts }) => posts.length >= 365
    },
    {
        id: "milestone_500",
        name: "グランドマスター",
        icon: "🪐",
        hint: "500回の記録を達成する",
        description: "500杯達成。もはや体液がコーヒーになっているレベル。",
        condition: ({ posts }) => posts.length >= 500
    },
    {
        id: "milestone_1000",
        name: "宇宙のコーヒー",
        icon: "🌌",
        hint: "1000回の記録を達成する",
        description: "1000杯達成。あなたのコーヒー愛は銀河にも届く。",
        condition: ({ posts }) => posts.length >= 1000
    },

    // ========================================================================
    // 🔥 継続の力 (Streaks)
    // ========================================================================
    {
        id: "streak_3",
        name: "三日坊主卒業",
        icon: "🐣",
        hint: "3日連続で記録をつける",
        description: "3日連続ログ投稿。三日坊主とは言わせない！",
        condition: ({ posts }) => getStreak(posts) >= 3
    },
    {
        id: "streak_7",
        name: "ウィークリー・ルーティン",
        icon: "🔥",
        hint: "1週間連続で記録をつける",
        description: "7日連続ログ投稿。完璧な一週間だったね！",
        condition: ({ posts }) => getStreak(posts) >= 7
    },
    {
        id: "streak_14",
        name: "2週間チャレンジ",
        icon: "🔥🔥",
        hint: "2週間連続で記録をつける",
        description: "14日連続ログ投稿。生活リズムが整ってきた証拠。",
        condition: ({ posts }) => getStreak(posts) >= 14
    },
    {
        id: "streak_30",
        name: "マンスリー・キング",
        icon: "🏆",
        hint: "30日連続で記録をつける",
        description: "30日連続ログ投稿。1ヶ月欠かさず記録したのは偉業です！",
        condition: ({ posts }) => getStreak(posts) >= 30
    },

    // ========================================================================
    // 🌍 産地巡礼 (Origins)
    // ========================================================================
    // Ethiopia
    {
        id: "origin_ethiopia_beginner",
        name: "エチオピア入門",
        icon: "🇪🇹",
        hint: "エチオピアのコーヒーを3回飲む",
        description: "コーヒー発祥の地、エチオピアの味を知る者。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeOrigin || p.coffeeName, ["エチオピア", "ethiopia", "モカ", "イルガチェフェ"])) >= 3
    },
    {
        id: "origin_ethiopia_master",
        name: "エチオピアの守護者",
        icon: "🦁",
        hint: "エチオピアのコーヒーを20回飲む",
        description: "フルーティーな香りの虜になったあなたへ。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeOrigin || p.coffeeName, ["エチオピア", "ethiopia", "モカ", "イルガチェフェ"])) >= 20
    },
    // Brazil
    {
        id: "origin_brazil_lover",
        name: "サンバのリズム",
        icon: "🇧🇷",
        hint: "ブラジルのコーヒーを5回飲む",
        description: "ブラジルコーヒーのナッツ感とバランスを愛する証。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeOrigin || p.coffeeName, ["ブラジル", "brazil", "サントス", "セラード"])) >= 5
    },
    // Indonesia
    {
        id: "origin_indonesia_fan",
        name: "マンデリン中毒",
        icon: "🇮🇩",
        hint: "インドネシアのコーヒーを5回飲む",
        description: "あの大地のようなアーシーな香りが癖になった？",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeOrigin || p.coffeeName, ["インドネシア", "indonesia", "マンデリン", "トラジャ"])) >= 5
    },
    // Colombia
    {
        id: "origin_colombia_buddy",
        name: "エメラルドの輝き",
        icon: "🇨🇴",
        hint: "コロンビアのコーヒーを5回飲む",
        description: "マイルドで飲みやすいコロンビアとの友情の証。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeOrigin || p.coffeeName, ["コロンビア", "colombia", "スプレモ"])) >= 5
    },
    // Guatemala
    {
        id: "origin_guatemala_mystic",
        name: "マヤの秘宝",
        icon: "🇬🇹",
        hint: "グアテマラのコーヒーを5回飲む",
        description: "スモーキーで上品な酸味を楽しむ高貴な舌。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeOrigin || p.coffeeName, ["グアテマラ", "guatemala", "アンティグア"])) >= 5
    },
    // Kenya
    {
        id: "origin_kenya_acid",
        name: "赤道直下の衝撃",
        icon: "🇰🇪",
        hint: "ケニアのコーヒーを3回飲む",
        description: "あの強烈な酸味（Acidity）を乗りこなした！",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeOrigin || p.coffeeName, ["ケニア", "kenya"])) >= 3
    },
    // Tanzania
    {
        id: "origin_tanzania_snow",
        name: "キリマンジャロの雪",
        icon: "🇹🇿",
        hint: "タンザニアのコーヒーを3回飲む",
        description: "野性味あふれるシャープな酸味を体験した。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeOrigin || p.coffeeName, ["タンザニア", "tanzania", "キリマンジャロ"])) >= 3
    },
    // Multiple Origins
    {
        id: "origin_traveler",
        name: "世界一周旅行",
        icon: "✈️",
        hint: "5つの異なる産地のコーヒーを記録する",
        description: "5カ国以上のコーヒーを制覇。パスポートはコーヒーのシミだらけ？",
        condition: ({ posts }) => {
            const origins = new Set();
            posts.forEach(p => {
                const text = (p.coffeeOrigin || p.coffeeName).toLowerCase();
                if (text.includes("エチオピア") || text.includes("ethiopia")) origins.add("ethiopia");
                if (text.includes("ブラジル") || text.includes("brazil")) origins.add("brazil");
                if (text.includes("コロンビア") || text.includes("colombia")) origins.add("colombia");
                if (text.includes("インドネシア") || text.includes("マンデリン")) origins.add("indonesia");
                if (text.includes("グアテマラ") || text.includes("guatemala")) origins.add("guatemala");
                if (text.includes("ケニア") || text.includes("kenya")) origins.add("kenya");
                if (text.includes("タンザニア") || text.includes("tanzania")) origins.add("tanzania");
            });
            return origins.size >= 5;
        }
    },

    // ========================================================================
    // ⏰ 時間帯とスタイル (Time & Style)
    // ========================================================================
    {
        id: "time_morning_bird",
        name: "早起きバリスタ",
        icon: "🌅",
        hint: "早朝（5時〜8時）に5回記録する",
        description: "朝の静けさとコーヒーの香りを愛する朝活勢。",
        condition: ({ posts }) => countByCondition(posts, p => {
            const h = (p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt)).getHours();
            return h >= 5 && h < 8;
        }) >= 5
    },
    {
        id: "time_night_owl",
        name: "ミッドナイト・カフェ",
        icon: "🦉",
        hint: "深夜（23時〜3時）に5回記録する",
        description: "真夜中のコーヒーは背徳の味。夜更かしのお供に。",
        condition: ({ posts }) => countByCondition(posts, p => {
            const h = (p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt)).getHours();
            return h >= 23 || h < 3;
        }) >= 5
    },
    {
        id: "time_lunch_break",
        name: "ランチタイムの常連",
        icon: "🕛",
        hint: "お昼（11時〜13時）に10回記録する",
        description: "食後のコーヒーは欠かせない。午後へのエネルギーチャージ。",
        condition: ({ posts }) => countByCondition(posts, p => {
            const h = (p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt)).getHours();
            return h >= 11 && h < 14;
        }) >= 10
    },
    {
        id: "style_ice_lover",
        name: "氷の心",
        icon: "🧊",
        hint: "アイスコーヒーを10回記録する",
        description: "冬でもアイス！キンキンに冷えた一杯を愛する人。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeName, ["アイス", "ice", "コールドブリュー", "水出し"])) >= 10
    },
    {
        id: "style_decaf_user",
        name: "優しい選択",
        icon: "🌿",
        hint: "デカフェを5回記録する",
        description: "カフェインレスを楽しむ余裕。身体を労る優しい選択。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeName, ["デカフェ", "レス", "decaf"])) >= 5
    },
    {
        id: "style_blend_master",
        name: "ブレンドの指揮者",
        icon: "🎼",
        hint: "「ブレンド」と名のつくコーヒーを10回記録する",
        description: "シングリオジンもいいけど、お店ごとのブレンドの妙を楽しむ玄人。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.coffeeName, ["ブレンド", "blend"])) >= 10
    },

    // ========================================================================
    // ✍️ 記録の内容 (Content)
    // ========================================================================
    {
        id: "content_poet",
        name: "コーヒー詩人",
        icon: "🖋️",
        hint: "50文字以上の感想を5回書く",
        description: "その味の表現力はもはや文学。読むだけで香りそう。",
        condition: ({ posts }) => countByCondition(posts, p => p.flavorText && p.flavorText.length >= 50) >= 5
    },
    {
        id: "content_short",
        name: "一言入魂",
        icon: "💬",
        hint: "コメント付きの投稿を50回行う",
        description: "継続は力なり。毎日の一言が積み重なって歴史になる。",
        condition: ({ posts }) => countByCondition(posts, p => p.flavorText && p.flavorText.length > 0) >= 50
    },
    {
        id: "content_favorite_hunter",
        name: "「好き」に囲まれて",
        icon: "❤️",
        hint: "お気に入りを10個見つける",
        description: "自分にとっての「最高」を10個も見つけた幸せ者。",
        condition: ({ posts }) => countByCondition(posts, p => p.isFavorite) >= 10
    },
    {
        id: "content_aging_master",
        name: "エイジングの達人",
        icon: "🕰️",
        hint: "焙煎から14日以上経過した豆を記録する",
        description: "飲み頃を見極める目利きの持ち主。",
        condition: ({ posts }) => countByCondition(posts, p => p.aging && p.aging >= 14) >= 1
    },

    // ========================================================================
    // 📍 場所 (Location)
    // ========================================================================
    {
        id: "loc_home",
        name: "おうちバリスタ",
        icon: "🏠",
        hint: "「家」または「自宅」で30回記録する",
        description: "自宅が一番のカフェ。丁寧な暮らしの達人。",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.location, ["家", "自宅", "home", "うち"])) >= 30
    },
    {
        id: "loc_cafe_hopper",
        name: "カフェホッパー",
        icon: "🏢",
        hint: "5箇所以上の異なる場所で記録する",
        description: "街中のカフェは私の庭。新しいお店開拓が趣味。",
        condition: ({ posts }) => {
            const locs = new Set(posts.map(p => p.location).filter(l => l && l !== "どこか" && !hasKeyword(l, ["家", "自宅"])));
            return locs.size >= 5;
        }
    },
    {
        id: "loc_unknown",
        name: "迷子のバリスタ",
        icon: "🛸",
        hint: "場所が「不明」または「どこか」の記録を10回する",
        description: "場所なんて関係ない。コーヒーがあればそこが宇宙。",
        condition: ({ posts }) => countByCondition(posts, p => !p.location || p.location === "どこか" || p.location === "不明") >= 10
    },

    // ========================================================================
    // 豆リスト (Bean List)
    // ========================================================================
    {
        id: "bean_collector_beginner",
        name: "豆コレクター（初級）",
        icon: "🎒",
        hint: "豆リストに3種類登録する",
        description: "豆を買い始めたばかりのワクワク感。",
        condition: ({ beans }) => beans.length >= 3
    },
    {
        id: "bean_collector_pro",
        name: "豆コレクター（上級）",
        icon: "🫘",
        hint: "豆リストに10種類登録する",
        description: "家の棚が豆の袋で埋め尽くされているのでは？",
        condition: ({ beans }) => beans.length >= 10
    },
    {
        id: "bean_shop_lover",
        name: "ロースターのファン",
        icon: "🏪",
        hint: "豆リストで同じ店名の豆を3つ登録する",
        description: "推しのロースターを見つけたようだね！",
        condition: ({ beans }) => {
            const counts: Record<string, number> = {};
            beans.forEach(b => {
                if (b.shopName) counts[b.shopName] = (counts[b.shopName] || 0) + 1;
            });
            return Object.values(counts).some(c => c >= 3);
        }
    },

    // ========================================================================
    // 🎭 スタンプ・フレーバー (Stamps)
    // ========================================================================
    {
        id: "flavor_sweet",
        name: "甘党バリスタ",
        icon: "🍬",
        hint: "SWEETスタンプを5回使う",
        condition: ({ posts }) => countByCondition(posts, p => p.flavorStamp === "SWEET") >= 5,
        description: "甘いコーヒーは正義。優しさが溢れている。",
    },
    {
        id: "flavor_juicy",
        name: "果実愛好家",
        icon: "🍊",
        hint: "JUICYスタンプを5回使う",
        condition: ({ posts }) => countByCondition(posts, p => p.flavorStamp === "JUICY") >= 5,
        description: "フルーツのような酸味を楽しむ、冒険心あるあなた。",
    },
    {
        id: "flavor_bitter",
        name: "渋い大人",
        icon: "☕",
        hint: "BITTERスタンプを5回使う",
        condition: ({ posts }) => countByCondition(posts, p => p.flavorStamp === "BITTER") >= 5,
        description: "人生の苦味を知る大人。深煎りの良さがわかる人。",
    },
    {
        id: "flavor_floral",
        name: "花言葉",
        icon: "🌸",
        hint: "FLORALスタンプを5回使う",
        condition: ({ posts }) => countByCondition(posts, p => p.flavorStamp === "FLORAL") >= 5,
        description: "華やかな香りに包まれて。エレガントなコーヒーライフ。",
    },
    {
        id: "comment_relax",
        name: "リラックスの達人",
        icon: "🌿",
        hint: "コメントに「リラックス」を含めて5回記録する",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.flavorText || "", ["RELAX", "リラックス", "癒し"])) >= 5,
        description: "言葉にするだけで癒やされる。コーヒーと言葉の魔法。",
    },
    {
        id: "comment_work",
        name: "集中モード",
        icon: "💻",
        hint: "コメントに「集中」を含めて5回記録する",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.flavorText || "", ["WORK", "集中", "作業"])) >= 5,
        description: "コーヒーは仕事のガソリン。バリバリ働くあなたへ。",
    },
    {
        id: "comment_refresh",
        name: "気分転換",
        icon: "✨",
        hint: "コメントに「リフレッシュ」を含めて5回記録する",
        condition: ({ posts }) => countByCondition(posts, p => hasKeyword(p.flavorText || "", ["REFRESH", "リフレッシュ", "スッキリ", "気分転換"])) >= 5,
        description: "切り替え上手は人生上手。",
    },

    // ========================================================================
    // 🤫 シークレット・面白系 (Secret / Fun)
    // ========================================================================
    {
        id: "secret_same_day",
        name: "カフェインオーバードーズ",
        icon: "🤪",
        hint: "？？？（1日に5杯飲む）",
        description: "1日に5杯も飲んだの！？今日はもう寝れないかもね！",
        secret: true,
        condition: ({ posts }) => {
            const dates = posts.map(p => (p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt)).toDateString());
            const counts: Record<string, number> = {};
            for (const d of dates) {
                counts[d] = (counts[d] || 0) + 1;
                if (counts[d] >= 5) return true;
            }
            return false;
        }
    },
    {
        id: "secret_zombie",
        name: "ゾンビ・バリスタ",
        icon: "🧟‍♂️",
        hint: "？？？（深夜2時〜4時に飲む）",
        description: "草木も眠る丑三つ時にコーヒーを…。あなたは人間ですか？",
        secret: true,
        condition: ({ posts }) => countByCondition(posts, p => {
            const h = (p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt)).getHours();
            return h >= 2 && h < 4;
        }) >= 1
    },
    {
        id: "secret_rich",
        name: "石油王",
        icon: "💎",
        hint: "？？？（「ゲイシャ」または「ブルマン」を飲む）",
        description: "高級豆の代名詞を味わった証。リッチな気分！",
        secret: true,
        condition: ({ posts }) => hasKeyword(posts.map(p => p.coffeeName).join(" "), ["ゲイシャ", "geisha", "ブルーマウンテン", "blue mountain"])
    },
    {
        id: "secret_cat",
        name: "猫",
        icon: "🐈",
        hint: "？？？（名前に「猫」が入る豆を飲む or 感想に書く）",
        description: "にゃーん。（猫に関連するコーヒーを楽しんだ）",
        secret: true,
        condition: ({ posts }) => posts.some(p => hasKeyword(p.coffeeName + p.flavorText, ["猫", "ネコ", "ねこ", "cat"]))
    }
];
