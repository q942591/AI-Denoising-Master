"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { SEO_CONFIG } from "~/app";
import { useSupabase } from "~/components/providers/SupabaseProvider";
import { GoogleIcon } from "~/ui/components/icons/google";
import { Starfield } from "~/ui/components/starfield";
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Label } from "~/ui/primitives/label";
import { Separator } from "~/ui/primitives/separator";

export function SignUpPageClient() {
  const { signInWithOAuth, signUpWithPassword } = useSupabase();
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 检查 URL 参数中是否有重定向地址
  const redirectPath = searchParams.get("redirect");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUpWithPassword(formData.email, formData.password, {
        data: {
          name: formData.name,
        },
      });
      // 如果有重定向路径，则使用它；否则使用默认路径
      router.push(
        redirectPath
          ? `/auth/sign-in?redirect=${encodeURIComponent(redirectPath)}`
          : "/auth/sign-in?registered=true"
      );
    } catch (err) {
      setError(t("signUpFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      // 将重定向路径添加到 OAuth 登录的 redirectTo URL 中
      await signInWithOAuth("google", redirectPath || "/");
    } catch (err) {
      setError(t("googleSignUpFailed"));
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        relative flex h-screen w-screen items-start justify-center
        overflow-hidden pt-20
        md:pt-24
      `}
    >
      {/* 渐变背景 */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-purple-50
          dark:from-black dark:via-gray-950 dark:to-black
        `}
      />

      {/* 星空装饰 */}
      <Starfield />

      {/* Brand info - 绝对定位到左下角 */}
      <div
        className={`
          absolute bottom-8 left-8 z-10 hidden
          lg:block
        `}
      >
        <div
          className={`
            text-gray-900
            dark:text-white
          `}
        >
          <h1
            className={`
              bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-4xl
              font-bold text-transparent
              dark:from-white dark:to-blue-200
            `}
          >
            {SEO_CONFIG.name}
          </h1>
          <p
            className={`
              mt-4 max-w-md text-lg text-gray-700
              dark:text-white/90
            `}
          >
            {SEO_CONFIG.slogan}
          </p>
          <div className="mt-6 flex space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            <div
              className="h-2 w-2 animate-pulse rounded-full bg-purple-400"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="h-2 w-2 animate-pulse rounded-full bg-pink-400"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>

      {/* Sign up form - 整个屏幕居中 */}
      <div className={`relative z-20 flex items-center justify-center p-4`}>
        {/* 半透明背景 */}
        <div className="absolute inset-0" />
        <div className="relative z-10 w-[400px] max-w-md">
          <Card variant="accent">
            <CardHeader>
              <CardHeading>
                <CardTitle>{t("createAccount")}</CardTitle>
                <CardDescription>
                  {t("enterDetailsToCreateAccount")}
                </CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent className="pt-2">
              <form className="space-y-4" onSubmit={handleEmailSignUp}>
                <div className="grid gap-2">
                  <Label
                    className={`
                      text-gray-900
                      dark:text-white
                    `}
                    htmlFor="name"
                  >
                    {t("name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    onChange={handleChange}
                    placeholder={t("namePlaceholder")}
                    required
                    type="text"
                    value={formData.name}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    className={`
                      text-gray-900
                      dark:text-white
                    `}
                    htmlFor="email"
                  >
                    {t("emailAddress")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={formData.email}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    className={`
                      text-gray-900
                      dark:text-white
                    `}
                    htmlFor="password"
                  >
                    {t("password")}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    onChange={handleChange}
                    required
                    type="password"
                    value={formData.password}
                  />
                </div>
                {error && (
                  <div className="text-sm font-medium text-destructive">
                    {error}
                  </div>
                )}
                <Button className="w-full" disabled={loading} type="submit">
                  {loading ? t("creatingAccount") : t("createAccount")}
                </Button>
              </form>
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span
                    className={`
                      bg-white/80 px-2 text-gray-600
                      dark:bg-white/10 dark:text-white/70
                    `}
                  >
                    {t("orContinueWith")}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  className="flex w-full items-center justify-center"
                  disabled={loading}
                  onClick={handleGoogleSignUp}
                  variant="outline"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Google
                </Button>
              </div>
              <div
                className={`
                  mt-6 text-center text-sm text-gray-600
                  dark:text-white/70
                `}
              >
                {t("alreadyHaveAccount")}{" "}
                <Link
                  className={`
                    text-blue-600 underline-offset-4
                    hover:text-blue-800 hover:underline
                    dark:text-blue-400 dark:hover:text-blue-300
                  `}
                  href="/auth/sign-in"
                >
                  {t("signIn")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
