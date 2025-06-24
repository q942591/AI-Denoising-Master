"use client";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

import type { Locale } from "~/i18n";

import { getStoredLocale, setStoredLocale } from "~/i18n";
import { Button } from "~/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/ui/primitives/dropdown-menu";

export function LanguageToggle() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");
  const [isChanging, setIsChanging] = useState(false);

  const languages = [
    { code: "zh" as Locale, name: "中文" },
    { code: "en" as Locale, name: "English" },
  ];

  useEffect(() => {
    // 获取当前语言设置
    setCurrentLocale(getStoredLocale());
  }, []);

  const handleLanguageChange = (langCode: Locale) => {
    // 如果选择的语言与当前语言相同，则不执行任何操作
    if (langCode === currentLocale) {
      return;
    }

    try {
      // 设置正在切换状态
      setIsChanging(true);

      // 保存语言设置
      setStoredLocale(langCode);

      // 立即更新本地状态
      setCurrentLocale(langCode);

      // 稍微延迟后重置加载状态，让界面有时间更新
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
    } catch (error) {
      console.error("Failed to change language:", error);
      setIsChanging(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isChanging} size="sm" variant="ghost">
          <Globe className="h-4 w-4" />
          {/* <span className="ml-1">
            {isChanging
              ? "..."
              : languages.find((lang) => lang.code === currentLocale)?.name ||
                "Language"}
          </span> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            className={currentLocale === lang.code ? "bg-accent" : ""}
            disabled={isChanging}
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
