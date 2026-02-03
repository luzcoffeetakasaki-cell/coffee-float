const NG_WORDS = ["不味い", "まずい", "最悪", "ひどい", "汚い", "嫌い", "最低"];

/**
 * テキストにNGワードが含まれているかチェックし、含まれている単語を返す
 */
export const checkNgWords = (text: string): string[] => {
    return NG_WORDS.filter((word) => text.includes(word));
};
