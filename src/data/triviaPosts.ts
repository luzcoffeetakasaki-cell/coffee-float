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

    // Additional Trivia (51-100)
    { id: "t51", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：パーチメント", location: "精製所", flavorText: "脱穀前の内果皮がついた豆を「パーチメント」と呼びます。この状態で保管すると鮮度を保ちやすいです殻", flavorStamp: "BITTER", likes: 62, createdAt: NOW },
    { id: "t52", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ナチュラル精製", location: "エチオピア", flavorText: "収穫した実をそのまま天日干しにする精製方法。果肉の甘みが豆に移り、ベリーのような香りが強くなります🍓", flavorStamp: "JUICY", likes: 88, createdAt: NOW },
    { id: "t53", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ウォッシュド精製", location: "コロンビア", flavorText: "水洗いして果肉を完全に取り除く方法。酸味が際立ち、クリーンで雑味のない味わいになります清", flavorStamp: "JUICY", likes: 74, createdAt: NOW },
    { id: "t54", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ハニープロセス", location: "コスタリカ", flavorText: "粘液質を一部残して乾燥させる方法。独特のボディ感と蜂蜜のような甘みが生まれます🍯", flavorStamp: "SWEET", likes: 91, createdAt: NOW },
    { id: "t55", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ハスク", location: "肥料", flavorText: "精製過程で出る殻（ハスク）は、良質な肥料になります。最近ではお茶として飲む「カスカラ」も人気です☕️", flavorStamp: "JUICY", likes: 53, createdAt: NOW },
    { id: "t56", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：デカフェ抽出", location: "スイス", flavorText: "「スイスウォータープロセス」は、化学薬品を使わず水だけでカフェインを抜く、安全で美味しい最新技術です💧", flavorStamp: "SWEET", likes: 67, createdAt: NOW },
    { id: "t57", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：シェードツリー", location: "農園", flavorText: "コーヒーの木の横に背の高い木（シェードツリー）を植えると、直射日光を遮り、豆がゆっくり熟して美味しくなります🌳", flavorStamp: "FLORAL", likes: 82, createdAt: NOW },
    { id: "t58", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：サステナビリティ", location: "地球", flavorText: "フェアトレードやレインフォレスト・アライアンス認証の豆を買うことは、農家さんの生活と地球の環境を守ることになります🌍", flavorStamp: "BITTER", likes: 120, createdAt: NOW },
    { id: "t59", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：アナエロビック", location: "最新技術", flavorText: "「嫌気性発酵（アナエロビック）」は、酸素を遮断して発酵させる手法。シナモンや洋酒のような強烈な個性が生まれます🍷", flavorStamp: "JUICY", likes: 110, createdAt: NOW },
    { id: "t60", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カーボニック", location: "ワインから着想", flavorText: "炭酸ガスを満たしたタンクで発酵させる手法を「カーボニック・マセレーション」と呼びます。フルーティーさが爆発します🍇", flavorStamp: "JUICY", likes: 95, createdAt: NOW },
    { id: "t61", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ハワイのコナ", location: "ハワイ島", flavorText: "コナコーヒーは、ハワイ島の火山灰土壌で育つ希少な豆。苦味が少なく、滑らかな口当たりが特徴です🌺", flavorStamp: "FLORAL", likes: 84, createdAt: NOW },
    { id: "t62", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：パナマゲイシャ", location: "高級豆", flavorText: "元々はエチオピアのゲシャ村原産。ジャスミンのような高貴な香りと紅茶のような軽やかさが世界中を虜にしています🌸", flavorStamp: "FLORAL", likes: 135, createdAt: NOW },
    { id: "t63", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：インドモンスーン", location: "インド", flavorText: "湿った季節風（モンスーン）を浴びて黄金色になった豆。酸味が少なく、独特の古木のような香りがあります🇮🇳", flavorStamp: "BITTER", likes: 48, createdAt: NOW },
    { id: "t64", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：マンデリン", location: "スマトラ島", flavorText: "インドネシアのマンデリン族が栽培。重厚な苦味と、ハーブや土のようなワイルドな香りがファンを魅了します🌿", flavorStamp: "BITTER", likes: 92, createdAt: NOW },
    { id: "t65", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：スマトラ式", location: "インドネシア", flavorText: "生豆の水分が多い状態で脱穀する「スマトラ式」。この独特の精製がマンデリン特有の深い色と味を作ります🇮🇩", flavorStamp: "BITTER", likes: 76, createdAt: NOW },
    { id: "t66", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ケニア", location: "ケニア山", flavorText: "「力強い酸味」といえばケニア。カシスやトマトのような個性的なフレーバーと、厚みのあるボディが魅力です🍅", flavorStamp: "JUICY", likes: 81, createdAt: NOW },
    { id: "t67", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：イルガチェフェ", location: "エチオピア", flavorText: "エチオピアの中でも特別な産地。ダージリンのような上品な香りと、柑橘系の爽やかさが共存しています🍋", flavorStamp: "FLORAL", likes: 104, createdAt: NOW },
    { id: "t68", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：グアテマラ", location: "アンティグア", flavorText: "火山の斜面で栽培。チョコレートのような甘みと、スモーキーなニュアンスがある上品なコーヒーです🍫", flavorStamp: "SWEET", likes: 89, createdAt: NOW },
    { id: "t69", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：セントヘレナ", location: "絶海", flavorText: "ナポレオンが「これだけが楽しみだ」と絶賛したとされる、南大西洋の孤島で作られる超希少なコーヒーです🏝️", flavorStamp: "FLORAL", likes: 156, createdAt: NOW },
    { id: "t70", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ブラックアイ", location: "カスタマイズ", flavorText: "ドリップコーヒーの中にエスプレッソを1ショット追加したもの。カフェインの塊で強烈に目が覚めます👁️", flavorStamp: "BITTER", likes: 112, createdAt: NOW },
    { id: "t71", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：フラットホワイト", location: "オセアニア", flavorText: "カフェラテよりも泡が薄く、エスプレッソの味が強調されたクリーミーなドリンク。ニュージーランド発祥と言われます🇳🇿", flavorStamp: "SWEET", likes: 93, createdAt: NOW },
    { id: "t72", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ピコロラテ", location: "ミニサイズ", flavorText: "小さなグラスに濃厚なフォームミルクを注いだラテ。コーヒー感をしっかり味わいたい時におすすめです🤏", flavorStamp: "BITTER", likes: 61, createdAt: NOW },
    { id: "t73", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ダーティーコーヒー", location: "ビジュアル", flavorText: "冷たいミルクに直接エスプレッソを注ぎ、わざと層を崩して汚れたように見せる、韓国などで人気のスタイルです🌫️", flavorStamp: "BITTER", likes: 77, createdAt: NOW },
    { id: "t74", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カフェ・コン・パンナ", location: "イタリア", flavorText: "エスプレッソの上にふわふわのホイップクリームをのせたもの。苦味と甘みのコントラストが最高です🍦", flavorStamp: "SWEET", likes: 85, createdAt: NOW },
    { id: "t75", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：アフォガート", location: "デザート", flavorText: "バニラアイスに熱々のエスプレッソをかける、イタリア生まれの極上スイーツです🍨", flavorStamp: "SWEET", likes: 142, createdAt: NOW },
    { id: "t76", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：エアロプレス", location: "発明品", flavorText: "フリスビーメーカーが発明した、空気の圧力で淹れる器具。速くて美味しく、調整も自由自在で世界大会もあります🚀", flavorStamp: "JUICY", likes: 99, createdAt: NOW },
    { id: "t77", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ネルドリップ", location: "職人技", flavorText: "布（フランネル）のフィルターで淹れる方法。ペーパーより油分を逃さず、トロリとした甘い口当たりになります滑", flavorStamp: "SWEET", likes: 86, createdAt: NOW },
    { id: "t78", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：サイフォン", location: "理科実験", flavorText: "気圧の変化を使ってお湯を吸い上げる抽出法。見た目が美しく、香りが非常に強く残るのが特徴です🧪", flavorStamp: "FLORAL", likes: 73, createdAt: NOW },
    { id: "t79", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：マキネッタ", location: "イタリア家庭", flavorText: "イタリアのどこの家庭にもある直火式のエスプレッソメーカー。使い込むほどにコーヒーの油分が馴染んで美味しくなります🇮🇹", flavorStamp: "BITTER", likes: 108, createdAt: NOW },
    { id: "t80", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：トルココーヒー", location: "ユネスコ無形文化遺産", flavorText: "粉にした豆と水を直接お鍋で煮出す世界最古の抽出法。カップの底に残った粉の形で占いをすることもあります🔮", flavorStamp: "BITTER", likes: 94, createdAt: NOW },
    { id: "t81", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：抽出の3T", location: "基本", flavorText: "美味しいコーヒーのための3要素。Temperature（温度）、Time（時間）、Turbulence（攪拌）のことです⏱️", flavorStamp: "BITTER", likes: 58, createdAt: NOW },
    { id: "t82", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ブルーミング", location: "ドリップ", flavorText: "粉にお湯をかけて膨らませる「蒸らし」。新鮮な豆から出るガスが抜け、お湯が浸透しやすくなります（咲く）🌸", flavorStamp: "JUICY", likes: 115, createdAt: NOW },
    { id: "t83", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：テロワール", location: "土地の個性", flavorText: "コーヒーの味は、土壌、気候、標高、地形などの環境によって決まります。ワインと同じように産地特性を重視します🍇", flavorStamp: "JUICY", likes: 69, createdAt: NOW },
    { id: "t84", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カップテスト", location: "品質管理", flavorText: "「カッピング」と呼ばれ、スプーンで勢いよくすすって味と香りを審査します。音を立てるのが正しい作法です🥄", flavorStamp: "JUICY", likes: 72, createdAt: NOW },
    { id: "t85", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：Qグレーダー", location: "鑑定士", flavorText: "コーヒーの品質を評価できる世界共通の資格。非常に厳しい試験をパスした香りと味のスペシャリストです👔", flavorStamp: "BITTER", likes: 83, createdAt: NOW },
    { id: "t86", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：スペシャルティ", location: "概念", flavorText: "単に美味しいだけでなく、種子からカップまで（Seed to Cup）全ての工程において徹底的に品質管理されたコーヒーのことです🌟", flavorStamp: "FLORAL", likes: 128, createdAt: NOW },
    { id: "t87", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：サードウェーブ", location: "ムーブメント", flavorText: "コーヒーを単なる飲み物ではなく、豆の個性や焙煎方法にこだわる「文化」として楽しむ新しい大きな波のことです🌊", flavorStamp: "JUICY", likes: 102, createdAt: NOW },
    { id: "t88", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：コーヒーと脳", location: "健康", flavorText: "コーヒーの香りには脳の活性化を促し、リラックスさせるα波を出す効果があると言われています🧠", flavorStamp: "FLORAL", likes: 145, createdAt: NOW },
    { id: "t89", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：二日酔い", location: "健康", flavorText: "カフェインには血管を収縮させる作用があり、二日酔いの時の頭痛を和らげる効果があるそうです（飲み過ぎに注意！）🍺", flavorStamp: "BITTER", likes: 87, createdAt: NOW },
    { id: "t90", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：運動効果", location: "ダイエット", flavorText: "運動の30分から60分前にコーヒーを飲むと、脂肪の燃焼効率が上がると言われています🏃", flavorStamp: "BITTER", likes: 119, createdAt: NOW },
    { id: "t91", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：クロロゲン酸", location: "美容", flavorText: "コーヒーに含まれるポリフェノール。強い抗酸化作用があり、美容や健康維持に役立つと言われています✨", flavorStamp: "JUICY", likes: 96, createdAt: NOW },
    { id: "t92", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：砂糖の話", location: "豆知識", flavorText: "昔、コーヒーに砂糖を入れて飲むのは贅沢の象徴でした。現在でも中東などでは砂糖をたっぷり入れるのがおもてなしの心です🤝", flavorStamp: "SWEET", likes: 64, createdAt: NOW },
    { id: "t93", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：ミルクの話", location: "豆知識", flavorText: "コーヒーにミルクを入れるのは17世紀の医師がすすめたのが始まりという説があります。栄養価を高めるためだったとか🥛", flavorStamp: "SWEET", likes: 71, createdAt: NOW },
    { id: "t94", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：冷凍保存", location: "保存術", flavorText: "長期保存（1ヶ月以上）なら冷凍庫がおすすめ。ただし、結露を避けるため使う分だけ取り出してすぐに戻しましょう❄️", flavorStamp: "BITTER", likes: 132, createdAt: NOW },
    { id: "t95", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：光は大敵", location: "保存術", flavorText: "コーヒー豆は光に弱く、透明な瓶でも日光や蛍光灯の光で劣化します。遮光性の高い缶やアルミの袋が一番です🔦", flavorStamp: "BITTER", likes: 76, createdAt: NOW },
    { id: "t96", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：コーヒーの花", location: "農園", flavorText: "実は真っ白でジャスミンのような甘い香りの花を咲かせます。開花時期は非常に短く、見られたらラッキーな景色です🌼", flavorStamp: "FLORAL", likes: 154, createdAt: NOW },
    { id: "t97", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：カフェ・ソスペゾ", location: "文化", flavorText: "「保留コーヒー」の元々の名前。一人のコーヒーに二つのコーヒー。愛され続けているイタリア・ナポリの伝統です❤️", flavorStamp: "SWEET", likes: 180, createdAt: NOW },
    { id: "t98", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：豆のサイズ", location: "スクリーン", flavorText: "豆の大きさは「スクリーンサイズ」と呼ばれ、大きな網目のふるいにかけて選別されます。大きい豆ほど高級とされることが多いです📏", flavorStamp: "BITTER", likes: 55, createdAt: NOW },
    { id: "t99", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：コーヒーと絆", location: "エピローグ", flavorText: "コーヒーを介して人との繋がりが生まれることも。このアプリが、あなたの新しいコーヒー体験のきっかけになりますように🤝", flavorStamp: "FLORAL", likes: 500, createdAt: NOW },
    { id: "t100", userId: "master", nickname: "Coffee Float Master", coffeeName: "豆知識：世界に一つ", location: "今日", flavorText: "あなたが今日淹れたその一杯は、この世にたった一つの特別な味わいです。大切に楽しんでくださいね☕️✨", flavorStamp: "SWEET", likes: 1000, createdAt: NOW },
];
