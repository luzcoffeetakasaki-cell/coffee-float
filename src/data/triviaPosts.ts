import { Timestamp } from "firebase/firestore";

interface Post {
    id: string;
    userId: string;
    nickname: string;
    coffeeName: string;
    location: string;
    flavorText: string;
    flavorStamp?: string | null;
    likes: number;
    createdAt: Timestamp;
}

const NOW = { toDate: () => new Date() } as any;

export const TRIVIA_POSTS: Post[] = [
    // History & Legends
    { id: "t1", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：発見の伝説", location: "エチオピア", flavorText: "コーヒーは9世紀頃、ヤギ飼いのカルディが「ヤギが赤い実を食べて興奮している」のを見て発見されたと言われています🐐", flavorStamp: "BITTER", likes: 100, createdAt: NOW },
    { id: "t2", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：語源", location: "アラビア", flavorText: "「コーヒー（Coffee）」の語源は、アラビア語の「カフワ（Qahwa/ワインの意味）」から来ています🍷", flavorStamp: "FLORAL", likes: 76, createdAt: NOW },
    { id: "t3", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：日本初", location: "長崎", flavorText: "日本に初めてコーヒーが伝わったのは江戸時代。オランダ商人が長崎の出島に持ち込んだのが最初と言われています🇯🇵", flavorStamp: "BITTER", likes: 50, createdAt: NOW },
    { id: "t4", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：バッハ", location: "ドイツ", flavorText: "音楽家のバッハは無類のコーヒー好きで、『コーヒー・カンタータ』という曲まで作曲しています🎼", flavorStamp: "SWEET", likes: 65, createdAt: NOW },
    { id: "t5", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：当時の薬", location: "ヨーロッパ", flavorText: "昔のヨーロッパでは、コーヒーは嗜好品ではなく「胃薬」や「万能薬」として薬局で売られていました💊", flavorStamp: "BITTER", likes: 40, createdAt: NOW },

    // Bean Knowledge
    { id: "t6", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：種です", location: "農園", flavorText: "コーヒー豆は「豆」と呼ばれていますが、植物学的には「コーヒーノキの果実（チェリー）の種」なんです🍒", flavorStamp: "SWEET", likes: 95, createdAt: NOW },
    { id: "t7", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：三大原種", location: "植物学", flavorText: "コーヒーには「アラビカ種」「ロブスタ種（カネフォラ）」「リベリカ種」の3大原種があります🌿", flavorStamp: "FLORAL", likes: 45, createdAt: NOW },
    { id: "t8", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ピーベリー", location: "選別場", flavorText: "通常は1つの実に2つの豆が入っていますが、稀に1つしか入っていない丸い豆を「ピーベリー」と呼びます💎", flavorStamp: "JUICY", likes: 88, createdAt: NOW },
    { id: "t9", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カフェイン量", location: "焙煎所", flavorText: "実は「深煎り」よりも「浅煎り」の方が、粒のまま比較した時のカフェイン含有量はわずかに多い傾向があります💡", flavorStamp: "JUICY", likes: 82, createdAt: NOW },
    { id: "t10", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：赤い実", location: "農園", flavorText: "完熟したコーヒーの実（コーヒーチェリー）は、サクランボのように真っ赤で、果肉は甘いんですよ🍒", flavorStamp: "SWEET", likes: 70, createdAt: NOW },

    // Roast & Brewing
    { id: "t11", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：エスプレッソ", location: "イタリア", flavorText: "「エスプレッソ」はイタリア語で「急行」の意味。「注文を受けてから急速に淹れる」ことから来ています🚆", flavorStamp: "BITTER", likes: 110, createdAt: NOW },
    { id: "t12", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：アメリカーノ", location: "イタリア", flavorText: "「アメリカーノ」は、第二次大戦中に米兵がエスプレッソをお湯で薄めて飲んだのが始まりだとか🇺🇸", flavorStamp: "BITTER", likes: 64, createdAt: NOW },
    { id: "t13", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：水出し", location: "抽出", flavorText: "お湯ではなく水でゆっくり抽出する「コールドブリュー」は、苦味や渋みが出にくく、まろやかな味になります💧", flavorStamp: "SWEET", likes: 92, createdAt: NOW },
    { id: "t14", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：90度", location: "キッチン", flavorText: "ドリップコーヒーに最適なお湯の温度は90度前後。沸騰したてのお湯だと雑味が出やすくなってしまいます🌡️", flavorStamp: "BITTER", likes: 55, createdAt: NOW },
    { id: "t15", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カプチーノ", location: "修道院", flavorText: "「カプチーノ」の名前は、カプチン修道会の修道士が着ていた茶色の服の色とフードに似ていたから…という説があります🙏", flavorStamp: "SWEET", likes: 90, createdAt: NOW },

    // World & Culture
    { id: "t16", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：消費量", location: "フィンランド", flavorText: "世界で一番コーヒーを飲む国はフィンランド！一人当たり1日4〜5杯も飲むそうですよ🇫🇮", flavorStamp: "JUICY", likes: 120, createdAt: NOW },
    { id: "t17", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：世界三大", location: "タンザニア", flavorText: "世界三大コーヒーといえば、「ブルーマウンテン（ジャマイカ）」「コナ（ハワイ）」そして「キリマンジャロ（タンザニア）」です⛰️", flavorStamp: "BITTER", likes: 88, createdAt: NOW },
    { id: "t18", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：サスペンド", location: "ナポリ", flavorText: "イタリア・ナポリには、貧しい誰かのためにコーヒー代を余分に払っておく「保留コーヒー」という粋な文化があります🇮🇹", flavorStamp: "SWEET", likes: 150, createdAt: NOW },
    { id: "t19", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ウィンナ", location: "ウィーン", flavorText: "「ウィンナ・コーヒー」はウィーン風コーヒーの意味ですが、現地では「アインシュぺナー」と呼びます🎻", flavorStamp: "SWEET", likes: 60, createdAt: NOW },
    { id: "t20", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ベトナム", location: "ベトナム", flavorText: "ベトナムコーヒーは、練乳（コンデンスミルク）をたっぷり入れて甘く濃厚にして飲むのがスタイルです🇻🇳", flavorStamp: "SWEET", likes: 72, createdAt: NOW },

    // Misc & Fun Facts
    { id: "t21", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：デカフェ", location: "実験室", flavorText: "デカフェ（カフェインレス）でも、実は抽出工程でごく微量（数%以下）のカフェインは残っていることが多いんです☕️", flavorStamp: "SWEET", likes: 55, createdAt: NOW },
    { id: "t22", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：コピ・ルアク", location: "インドネシア", flavorText: "ジャコウネコの糞から採られる世界一高価なコーヒー「コピ・ルアク」。独特の複雑な香味があるそうです🐈", flavorStamp: "BITTER", likes: 98, createdAt: NOW },
    { id: "t23", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：生産量", location: "ブラジル", flavorText: "世界最大のコーヒー生産国はブラジル。世界のコーヒーの約3分の1がブラジルで作られています🇧🇷", flavorStamp: "BITTER", likes: 80, createdAt: NOW },
    { id: "t24", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：モカ", location: "イエメン", flavorText: "「モカ」は、コーヒー積み出し港であったイエメンの「モカ港」に由来します🚢", flavorStamp: "FLORAL", likes: 68, createdAt: NOW },
    { id: "t25", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：缶コーヒー", location: "日本", flavorText: "世界初の缶コーヒーが開発されたのは実は日本。「UCC」が1969年に発売したのが始まりです🇯🇵", flavorStamp: "SWEET", likes: 110, createdAt: NOW },
    { id: "t26", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：賞味期限", location: "キッチン", flavorText: "コーヒー豆は生鮮食品。粉にすると表面積が増えて酸化が進むので、できれば「豆のまま」保存するのがベストです🫙", flavorStamp: "BITTER", likes: 75, createdAt: NOW },
    { id: "t27", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：深煎り", location: "焙煎所", flavorText: "深煎りの豆の表面がテカテカしているのは、豆の内部からコーヒーオイル（油分）が染み出しているからです✨", flavorStamp: "BITTER", likes: 66, createdAt: NOW },
    { id: "t28", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カフェオレ", location: "フランス", flavorText: "カフェオレは普通のコーヒーとミルク、カフェラテはエスプレッソとミルク。ベースになるコーヒーが違います🇫🇷", flavorStamp: "SWEET", likes: 90, createdAt: NOW },
    { id: "t29", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：生産ベルト", location: "赤道", flavorText: "コーヒー栽培に適した赤道付近のエリアを「コーヒーベルト」と呼びます🌍", flavorStamp: "JUICY", likes: 58, createdAt: NOW },
    { id: "t30", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：インスタント", location: "歴史", flavorText: "インスタントコーヒーが普及したきっかけの一つは、第二次世界大戦での兵士への配給だったと言われています🎖️", flavorStamp: "BITTER", likes: 45, createdAt: NOW },

    // More Trivia
    { id: "t31", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：悪魔の飲み物", location: "バチカン", flavorText: "昔、コーヒーは「異教徒の飲み物」と恐れられましたが、教皇が味見して「こんな美味いものを異教徒に独占させるな」と洗礼を施したとか⛪️", flavorStamp: "BITTER", likes: 130, createdAt: NOW },
    { id: "t32", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：フラペチーノ", location: "アメリカ", flavorText: "「フラペチーノ」はフラッペ（カキ氷）とカプチーノを合わせた造語。実はスターバックスの登録商標なんです🥤", flavorStamp: "SWEET", likes: 105, createdAt: NOW },
    { id: "t33", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：バリスタ", location: "イタリア", flavorText: "「バリスタ」はイタリア語で「バール（Bar）で働く人」のこと。コーヒーのスペシャリストです🤵‍♂️", flavorStamp: "BITTER", likes: 77, createdAt: NOW },
    { id: "t34", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：消臭効果", location: "キッチン", flavorText: "抽出後のかすには、活性炭以上の脱臭効果があると言われています。乾燥させて靴箱に入れるとGoodです👟", flavorStamp: "BITTER", likes: 92, createdAt: NOW },
    { id: "t35", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：エメラルド", location: "パナマ", flavorText: "「ゲイシャ種」を一躍有名にしたのは、パナマのエスメラルダ農園。品評会でありえない高値を記録しました🏆", flavorStamp: "FLORAL", likes: 85, createdAt: NOW },
    { id: "t36", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ブレンド", location: "焙煎所", flavorText: "「ブレンド」は、異なる豆を混ぜることで、単体では出せない複雑な味や、安定した味を作り出す職人技です⚖️", flavorStamp: "BITTER", likes: 60, createdAt: NOW },
    { id: "t37", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：純喫茶", location: "日本", flavorText: "「純喫茶」とは、かつて酒類を扱う「特殊喫茶」と区別するために、「純粋にコーヒーを楽しむ店」として名乗ったのが始まりです🍮", flavorStamp: "BITTER", likes: 115, createdAt: NOW },
    { id: "t38", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カフェイン", location: "体内", flavorText: "カフェインの効果が出るのは飲んでから30分〜1時間後。お昼寝の直前に飲むと、目覚める頃にスッキリします（コーヒーナップ）💤", flavorStamp: "BITTER", likes: 99, createdAt: NOW },
    { id: "t39", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：離婚原因", location: "トルコ", flavorText: "16世紀のトルコでは「夫が十分なコーヒーを与えなかった場合、妻は離婚を要求できる」という法律があったそうです🇹🇷", flavorStamp: "BITTER", likes: 88, createdAt: NOW },
    { id: "t40", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：一番高い山", location: "キリマンジャロ", flavorText: "「キリマンジャロ」はアフリカ大陸最高峰の山の名前。その麓で栽培されるコーヒーもしっかりした酸味が特徴です🗻", flavorStamp: "JUICY", likes: 70, createdAt: NOW },
    { id: "t41", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：収穫", location: "農園", flavorText: "高品質なコーヒー豆は、機械を使わず、完熟した実だけを人の手で一粒ずつ選んで摘み取っています（ハンドピック）🤲", flavorStamp: "SWEET", likes: 80, createdAt: NOW },
    { id: "t42", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：エイジング", location: "倉庫", flavorText: "通常は新鮮な豆が好まれますが、あえて数年寝かせて独特の風味を引き出す「オールドクロップ（エイジングコーヒー）」もあります🕰️", flavorStamp: "BITTER", likes: 65, createdAt: NOW },
    { id: "t43", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ギネス", location: "アメリカ", flavorText: "世界最大のアイスコーヒーのカップは、ラスベガスで作られ、なんとプールくらいのサイズ（約2万リットル）だったそうです🥤", flavorStamp: "SWEET", likes: 50, createdAt: NOW },
    { id: "t44", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ベートーヴェン", location: "ドイツ", flavorText: "ベートーヴェンは毎朝きっちり60粒の豆を数えてコーヒーを淹れるこだわり派でした🎹", flavorStamp: "BITTER", likes: 78, createdAt: NOW },
    { id: "t45", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：フレンチプレス", location: "フランス", flavorText: "金属フィルターでプレスして淹れる「フレンチプレス」は、コーヒーオイルまで丸ごと抽出できるので、豆本来の味が楽しめます🇫🇷", flavorStamp: "BITTER", likes: 72, createdAt: NOW },
    { id: "t46", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：焙煎度", location: "知識", flavorText: "焙煎度合いは8段階あり、「ライトロースト」が一番浅く、「イタリアンロースト」が一番深い焙煎です🔥", flavorStamp: "BITTER", likes: 55, createdAt: NOW },
    { id: "t47", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：第二の石油", location: "経済", flavorText: "コーヒーは、石油に次いで世界で2番目に取引額の大きい貿易商品だと言われることがあります（諸説あり）💰", flavorStamp: "BITTER", likes: 90, createdAt: NOW },
    { id: "t48", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ラテアート", location: "シアトル", flavorText: "ラテアートは、エスプレッソのクレマ（泡）とスチームミルクの対比を利用して描いています🎨", flavorStamp: "SWEET", likes: 100, createdAt: NOW },
    { id: "t49", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：猫舌", location: "温度", flavorText: "実はコーヒーの香り成分は熱すぎる時よりも、少し冷めた時（60~70度）の方が感じやすかったりします👃", flavorStamp: "FLORAL", likes: 82, createdAt: NOW },
    { id: "t50", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：あなた", location: "ここ", flavorText: "今この豆知識を読んでいるあなたこそが、最高のコーヒー愛好家です！さあ、良いコーヒーライフを！☕️", flavorStamp: "BITTER", likes: 999, createdAt: NOW },
];
