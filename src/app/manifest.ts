
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Coffee Float',
        short_name: 'CoffeeFloat',
        description: '今、この瞬間の美味しいを共有する。コーヒーの感動共有アプリ。',
        start_url: '/',
        display: 'standalone', // ブラウザのUI（アドレスバー）を消す設定
        background_color: '#2c1810', // var(--bg-warm)
        theme_color: '#1a0f0a', // var(--bg-deep)
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
