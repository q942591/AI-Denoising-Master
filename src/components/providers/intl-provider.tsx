"use client";

import { NextIntlClientProvider } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";

import type { Locale } from "~/i18n";

import { getStoredLocale } from "~/i18n";

interface IntlProviderProps {
  children: ReactNode;
}

export function IntlProvider({ children }: IntlProviderProps) {
  const [locale, setLocale] = useState<Locale>("en");
  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLocale = async () => {
      try {
        const currentLocale = getStoredLocale();
        setLocale(currentLocale);

        const msgs = await import(`../../../messages/${currentLocale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error("Failed to load messages:", error);
        // 降级到英文
        const msgs = await import("../../../messages/en.json");
        setMessages(msgs.default);
        setLocale("en");
      } finally {
        setIsLoading(false);
      }
    };

    initLocale();
  }, []);

  // 监听语言变化并重新加载消息
  useEffect(() => {
    const handleLanguageChange = async () => {
      const newLocale = getStoredLocale();
      if (newLocale !== locale) {
        setIsLoading(true);
        try {
          const msgs = await import(`../../../messages/${newLocale}.json`);
          setMessages(msgs.default);
          setLocale(newLocale);
        } catch (error) {
          console.error(
            "Failed to load messages for locale:",
            newLocale,
            error
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    // 定时检查语言变化（简单但有效的方法）
    const interval = setInterval(handleLanguageChange, 200);

    return () => {
      clearInterval(interval);
    };
  }, [locale]);

  if (isLoading || !messages) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
