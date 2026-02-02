import liff from "@line/liff";

export const initLiff = async (liffId: string) => {
    try {
        await liff.init({ liffId });
        console.log("LIFF init success");
        if (!liff.isLoggedIn()) {
            liff.login();
        }
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
