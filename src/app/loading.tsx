"use client";

import { Cpu, Image, Sparkles, Wand2, Zap } from "lucide-react";

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black`}
    >
      {/* animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* gradient orbs */}
        <div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl"
          style={{
            animation: "pulse 4s ease-in-out infinite",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)",
          }}
        />
        <div
          className={`
            absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl
          `}
          style={{
            animation: "pulse 4s ease-in-out infinite",
            animationDelay: "1s",
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)",
          }}
        />
        <div
          className={`
            absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2
            -translate-y-1/2 rounded-full blur-3xl
          `}
          style={{
            animation: "pulse 4s ease-in-out infinite",
            animationDelay: "0.5s",
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)",
          }}
        />

        {/* floating particles */}
        <div
          className={`
            absolute top-20 left-20 h-2 w-2 animate-ping rounded-full
            bg-blue-400
          `}
        />
        <div
          className={`
            absolute top-40 right-32 h-1 w-1 animate-ping rounded-full
            bg-purple-400
          `}
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className={`
            absolute bottom-32 left-1/4 h-3 w-3 animate-ping rounded-full
            bg-green-400
          `}
          style={{ animationDelay: "0.7s" }}
        />
        <div
          className={`
            absolute right-20 bottom-20 h-1 w-1 animate-ping rounded-full
            bg-yellow-400
          `}
          style={{ animationDelay: "1s" }}
        />
        <div
          className={`
            absolute top-1/3 right-1/4 h-2 w-2 animate-ping rounded-full
            bg-pink-400
          `}
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* main loading content */}
      <div
        className={`
          relative z-10 flex flex-col items-center justify-center space-y-10
        `}
      >
        {/* logo/brand area */}
        <div className="space-y-4 text-center">
          <div className="relative">
            {/* main spinner */}
            <div
              className={`
                h-32 w-32 rounded-full border-4 border-gray-800
                border-t-blue-500
              `}
              style={{
                animation: "spin 1s linear infinite",
              }}
            />

            {/* inner rings */}
            <div
              className={`
                absolute inset-4 h-24 w-24 rounded-full border-2 border-gray-700
                border-r-purple-500
              `}
              style={{
                animation: "spin 2s linear infinite reverse",
              }}
            />
            <div
              className={`
                absolute inset-8 h-16 w-16 rounded-full border border-gray-600
                border-b-green-500
              `}
              style={{
                animation: "spin 1.5s linear infinite",
                animationDelay: "0.3s",
              }}
            />

            {/* center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`
                  rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4
                  shadow-2xl
                `}
                style={{
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* orbiting icons */}
            <div
              className="absolute inset-0"
              style={{
                animation: "spin 8s linear infinite",
              }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <Image className="h-5 w-5 text-blue-400" />
              </div>
              <div className="absolute top-1/2 -right-2 -translate-y-1/2">
                <Cpu className="h-4 w-4 text-purple-400" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <Wand2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="absolute top-1/2 -left-2 -translate-y-1/2">
                <Zap className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* loading text and status */}
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1
              className="bg-clip-text text-4xl font-bold text-transparent"
              style={{
                animation: "pulse 2s ease-in-out infinite",
                backgroundImage:
                  "linear-gradient(to right, #60a5fa, #a78bfa, #34d399)",
              }}
            >
              AI Image Processing
            </h1>
          </div>

          {/* animated loading dots */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-300">Loading</span>
            <div className="flex space-x-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-purple-500"
                style={{ animationDelay: "0.15s" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-green-500"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        </div>

        {/* progress indicators */}
        <div className="w-80 space-y-4">
          {/* main progress bar */}
          <div className="relative">
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className={`
                  h-full rounded-full bg-gradient-to-r from-blue-500
                  via-purple-500 to-green-500
                  ${styles.loadingProgress}
                `}
              />
            </div>
            <div
              className={`
                absolute -top-1 h-4 w-4 rounded-full bg-blue-500
                ${styles.loadingDot}
              `}
            />
          </div>

          {/* status steps */}
          <div className="flex justify-between text-sm text-gray-500">
            <span className="animate-pulse">加载模型</span>
            <span className="animate-pulse" style={{ animationDelay: "0.5s" }}>
              准备处理
            </span>
            <span className="animate-pulse" style={{ animationDelay: "1s" }}>
              即将完成
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
