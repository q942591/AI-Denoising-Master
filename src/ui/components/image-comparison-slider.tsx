"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "~/lib/utils";
import { Badge } from "~/ui/primitives/badge";

interface ImageComparisonSliderProps {
  afterAlt: string;
  afterImage: string;
  afterLabel: string;
  beforeAlt: string;
  beforeImage: string;
  beforeLabel: string;
  className?: string;
  dragToCompareText?: string;
  improvement?: string;
}

export function ImageComparisonSlider({
  afterAlt,
  afterImage,
  afterLabel,
  beforeAlt,
  beforeImage,
  beforeLabel,
  className,
  dragToCompareText = "拖拽对比",
  improvement,
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        e.preventDefault();
        updateSliderPosition(e.clientX);
      }
    },
    [isDragging, updateSliderPosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isDragging) {
        e.preventDefault();
        updateSliderPosition(e.touches[0].clientX);
      }
    },
    [isDragging, updateSliderPosition]
  );

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        updateSliderPosition(e.clientX);
      }
    },
    [isDragging, updateSliderPosition]
  );

  const handleGlobalTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        updateSliderPosition(e.touches[0].clientX);
      }
    },
    [isDragging, updateSliderPosition]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging && e.target === e.currentTarget) {
        updateSliderPosition(e.clientX);
      }
    },
    [isDragging, updateSliderPosition]
  );

  // 添加全局事件监听器，提供更好的拖拽体验
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleGlobalTouchMove);
      document.addEventListener("touchend", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ew-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, handleGlobalMouseMove, handleGlobalTouchMove, handleMouseUp]);

  return (
    <div
      className={cn(
        `
          group relative aspect-video overflow-hidden rounded-lg transition-all
          duration-300 ease-out select-none
          ${
            isDragging
              ? "cursor-ew-resize"
              : `
                cursor-pointer
                hover:cursor-ew-resize
              `
          }
        `,
        className
      )}
      onClick={handleClick}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
      ref={containerRef}
    >
      {/* 处理后的图像 (底层) */}
      <div className="absolute inset-0">
        <Image
          alt={afterAlt}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={afterImage}
        />
        <div className="absolute right-2 bottom-2">
          <Badge className="text-xs shadow-md" variant="primary">
            {afterLabel}
          </Badge>
        </div>
      </div>

      {/* 处理前的图像 (上层，可滑动) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          alt={beforeAlt}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={beforeImage}
        />
        <div className="absolute bottom-2 left-2">
          <Badge className="text-xs shadow-md" variant="secondary">
            {beforeLabel}
          </Badge>
        </div>
      </div>

      {/* 滑动线和控制点 */}
      <div
        className={`
          absolute top-0 bottom-0 z-10 w-0.5 cursor-ew-resize bg-white/90
          shadow-md backdrop-blur-sm transition-all duration-300 ease-out
          ${isDragging ? "w-1 shadow-lg" : "hover:w-0.5 hover:shadow-lg"}
        `}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        {/* 滑动控制点 */}
        <div
          className={`
            absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2
            -translate-y-1/2 transform cursor-ew-resize items-center
            justify-center rounded-full border border-white/50 bg-white/95
            shadow-lg backdrop-blur-sm transition-all duration-300 ease-out
            ${
              isDragging
                ? `
                  scale-125 border-primary/30 opacity-100 shadow-xl ring-2
                  ring-primary/20
                `
                : `
                  opacity-0
                  group-hover:opacity-100
                  hover:scale-110 hover:border-primary/20 hover:shadow-xl
                `
            }
          `}
        >
          {/* 拖拽图标 - 使用更细腻的线条 */}
          <div className="flex items-center space-x-0.5">
            <div
              className={`
                h-3 w-px rounded-full transition-colors duration-200
                ${isDragging ? "bg-primary/80" : "bg-gray-400/60"}
              `}
            />
            <div
              className={`
                h-4 w-px rounded-full transition-colors duration-200
                ${isDragging ? "bg-primary/80" : "bg-gray-400/60"}
              `}
            />
            <div
              className={`
                h-3 w-px rounded-full transition-colors duration-200
                ${isDragging ? "bg-primary/80" : "bg-gray-400/60"}
              `}
            />
          </div>
        </div>
      </div>

      {/* 改进百分比徽章 */}
      {improvement && (
        <div className="absolute top-3 right-3">
          <Badge
            appearance="outline"
            className={`
              border-green-200/50 bg-white/95 text-green-700 shadow-lg
              backdrop-blur-sm transition-all duration-300
              hover:scale-105 hover:shadow-xl
            `}
            variant="success"
          >
            +{improvement}
          </Badge>
        </div>
      )}

      {/* 使用说明提示 */}
      <div
        className={`
          absolute top-3 left-3 translate-y-1 opacity-0 transition-all
          duration-300 ease-out
          group-hover:translate-y-0 group-hover:opacity-100
        `}
      >
        <Badge
          className={`
            border-0 bg-black/80 text-xs text-white shadow-lg backdrop-blur-sm
          `}
          variant="secondary"
        >
          {dragToCompareText}
        </Badge>
      </div>
    </div>
  );
}
