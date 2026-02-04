import liff from "@line/liff";

let resolveInit: (value: boolean) => void;
export const liffReady = new Promise<boolean>((resolve) => {
    resolveInit = resolve;
});

export const initLiff = async (liffId: string) => {
    try {
        await liff.init({ liffId });
        console.log("LIFF init success");
        resolveInit(true);

        // LINEアプリ内ブラウザ（LIFF）で開いている場合は、強制的にログイン状態にする（UX向上）
        if (liff.isInClient() && !liff.isLoggedIn()) {
            liff.login();
        }
    } catch (error) {
        console.error("LIFF init failed", error);
        resolveInit(false);
    }
};

export const getLiffProfile = async () => {
    try {
        if (!liff.isLoggedIn()) return null;
        const profile = await liff.getProfile();
        return profile;
    } catch (error) {
        console.error("Failed to get LIFF profile", error);
        return null;
    }
};

export const login = () => {
    if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
    }
};
