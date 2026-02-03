import liff from "@line/liff";

export const initLiff = async (liffId: string) => {
    try {
        await liff.init({ liffId });
        console.log("LIFF init success");
        // 自動ログインは廃止 (PWA化のために初回表示を許可)
    } catch (error) {
        console.error("LIFF init failed", error);
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
