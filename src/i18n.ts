import { getRequestConfig } from "next-intl/server";

// 支持的语言列表
export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

// 获取浏览器首选语言
export function getBrowserLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language.toLowerCase();

  // 检查是否支持浏览器语言
  if (browserLang.startsWith("zh")) return "zh";
  if (browserLang.startsWith("en")) return "en";

  // 默认返回英文
  return "en";
}

// 从本地存储获取语言设置
export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";

  try {
    const stored = localStorage.getItem("locale") as Locale;
    if (stored && locales.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage 不可用时忽略错误
  }

  return getBrowserLocale();
}

// 保存语言设置到本地存储
export function setStoredLocale(locale: Locale) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("locale", locale);
  } catch {
    // localStorage 不可用时忽略错误
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  // 从请求中获取locale，如果没有则使用默认值
  let locale = await requestLocale;

  // 如果locale无效，使用默认英文
  if (!locale || !locales.includes(locale as any)) {
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
