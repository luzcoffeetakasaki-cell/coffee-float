import { getLiffProfile } from "./liff";

const STORAGE_KEY = "coffee_float_device_userId";

/**
 * 現在のユーザーIDを取得します。
 * 1. LINEログイン済みなら LIFF userId を返します。
 * 2. 未ログインなら、ローカルストレージに保存されたデバイスIDを返します。
 * 3. デバイスIDもなければ、新規に生成して保存します。
 */
export const getCurrentUserId = async (): Promise<string> => {
    // 1. LIFF ID try
    try {
        const profile = await getLiffProfile();
        if (profile?.userId) {
            return profile.userId;
        }
    } catch (e) {
        console.warn("LIFF profile fetch failed, falling back to device ID", e);
    }

    // 2. Local Storage check
    if (typeof window !== "undefined") {
        let deviceId = localStorage.getItem(STORAGE_KEY);

        // 3. Generate new ID if missing
        if (!deviceId) {
            deviceId = `guest_${crypto.randomUUID()}`;
            localStorage.setItem(STORAGE_KEY, deviceId);
        }
        return deviceId;
    }

    return "unknown_user";
};
