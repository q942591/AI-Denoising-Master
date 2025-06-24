"use client";

import { Eye, RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "~/utils/cn";

interface ImageProps {
  alt: string;
  className?: string;
  fallback?: string;
  height?: number;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;

  preview?: boolean;
  src: string;
  width?: number;
}

interface PreviewState {
  rotate: number;
  scale: number;
  visible: boolean;
  x: number;
  y: number;
}

const DEFAULT_PREVIEW_STATE: PreviewState = {
  rotate: 0,
  scale: 1,
  visible: false,
  x: 0,
  y: 0,
};

export function ImageComponent({
  alt,
  className,
  fallback = "/placeholder.svg",
  height,
  onClick,
  onError,
  onLoad,

  preview = true,
  src,
  width,
}: ImageProps) {
  const t = useTranslations("Image.preview");
  const [imageState, setImageState] = useState<"error" | "loaded" | "loading">(
    "loading"
  );
  const [previewState, setPreviewState] = useState<PreviewState>(
    DEFAULT_PREVIEW_STATE
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 重置预览状态
  const resetPreview = useCallback(() => {
    setPreviewState((prev) => ({
      ...prev,
      rotate: 0,
      scale: 1,
      x: 0,
      y: 0,
    }));
  }, []);

  // 打开预览
  const openPreview = useCallback(() => {
    if (!preview) return;
    setPreviewState((prev) => ({ ...prev, visible: true }));
    resetPreview();
    // 阻止body滚动
    document.body.style.overflow = "hidden";
  }, [preview, resetPreview]);

  // 关闭预览
  const closePreview = useCallback(() => {
    setPreviewState((prev) => ({ ...prev, visible: false }));
    document.body.style.overflow = "auto";
  }, []);

  // 缩放
  const handleZoom = useCallback((delta: number) => {
    setPreviewState((prev) => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, prev.scale + delta)),
    }));
  }, []);

  // 旋转
  const handleRotate = useCallback((direction: "left" | "right") => {
    setPreviewState((prev) => ({
      ...prev,
      rotate: prev.rotate + (direction === "left" ? -90 : 90),
    }));
  }, []);

  // 拖拽开始
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (previewState.scale <= 1) return;
      setIsDragging(true);
      setDragStart({
        x: e.clientX - previewState.x,
        y: e.clientY - previewState.y,
      });
    },
    [previewState.scale, previewState.x, previewState.y]
  );

  // 拖拽移动
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPreviewState((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    },
    [isDragging, dragStart]
  );

  // 拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 键盘事件
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!previewState.visible) return;

      switch (e.key) {
        case "+":
        case "=":
          handleZoom(0.2);
          break;
        case "-":
          handleZoom(-0.2);
          break;
        case "ArrowLeft":
          handleRotate("left");
          break;
        case "ArrowRight":
          handleRotate("right");
          break;
        case "Escape":
          closePreview();
          break;
      }
    },
    [previewState.visible, closePreview, handleZoom, handleRotate]
  );

  // 鼠标滚轮缩放
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta);
    },
    [handleZoom]
  );

  // 事件监听
  useEffect(() => {
    if (previewState.visible) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("keydown", handleKeyDown);

      const previewElement = previewRef.current;
      if (previewElement) {
        previewElement.addEventListener("wheel", handleWheel, {
          passive: false,
        });
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("keydown", handleKeyDown);
        if (previewElement) {
          previewElement.removeEventListener("wheel", handleWheel);
        }
      };
    }
  }, [
    previewState.visible,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleWheel,
  ]);

  // 图片加载成功
  const handleImageLoad = useCallback(() => {
    setImageState("loaded");
    onLoad?.();
  }, [onLoad]);

  // 图片加载失败
  const handleImageError = useCallback(() => {
    setImageState("error");
    onError?.();
  }, [onError]);

  // 点击处理
  const handleClick = useCallback(() => {
    if (preview) {
      openPreview();
    }
    onClick?.();
  }, [preview, openPreview, onClick]);

  const imageElement = (
    <div
      className={cn(
        "relative",
        // 如果传入的className包含h-full w-full，使用block让图片撑满容器
        className?.includes("h-full") && className?.includes("w-full")
          ? "block h-full w-full"
          : "inline-block",
        className
      )}
    >
      <Image
        alt={alt}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rq5wdwcWb2DEcTFqJNqF4Pqd1/I5quabrfA7/ANU9wuFl1PcL1n3Ggh9H+1U7X0Jy11dY1mLxL3Atco/vOhJ6WSnmVq42TJQmYEz/2Q=="
        className={cn(
          "transition-opacity duration-300",
          // 当容器为block时，图片也需要撑满
          className?.includes("h-full") && className?.includes("w-full")
            ? "h-full w-full object-cover"
            : "block",
          preview &&
            imageState === "loaded" &&
            `
              cursor-pointer
              hover:opacity-80
            `,
          imageState === "loading" && "opacity-50"
        )}
        height={height}
        onClick={handleClick}
        onError={handleImageError}
        onLoad={handleImageLoad}
        placeholder="blur"
        ref={imageRef}
        src={imageState === "error" ? fallback : src}
        width={width}
      />

      {/* 加载状态 */}
      {imageState === "loading" && (
        <div
          className={`
            absolute inset-0 flex items-center justify-center bg-gray-100
            dark:bg-gray-800
          `}
        >
          <div
            className={`
              h-8 w-8 animate-spin rounded-full border-2 border-gray-300
              border-t-blue-600
            `}
          />
        </div>
      )}

      {/* 预览图标 */}
      {preview && imageState === "loaded" && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-black/50 opacity-0 transition-opacity duration-300",
            `
              cursor-pointer
              hover:opacity-100
            `
          )}
          onClick={handleClick}
        >
          <Eye className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );

  // 预览模态框
  const previewModal = previewState.visible && (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center bg-black/90
      `}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closePreview();
        }
      }}
      ref={previewRef}
    >
      {/* 工具栏 */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-black/50 p-2">
          <button
            className={`
              rounded p-2 text-white
              hover:bg-white/20
            `}
            onClick={() => handleZoom(0.2)}
            title={`${t("zoomIn")} (+)`}
            type="button"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            className={`
              rounded p-2 text-white
              hover:bg-white/20
            `}
            onClick={() => handleZoom(-0.2)}
            title={`${t("zoomOut")} (-)`}
            type="button"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            className={`
              rounded p-2 text-white
              hover:bg-white/20
            `}
            onClick={() => handleRotate("left")}
            title={`${t("rotateLeft")} (←)`}
            type="button"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            className={`
              rounded p-2 text-white
              hover:bg-white/20
            `}
            onClick={() => handleRotate("right")}
            title={`${t("rotateRight")} (→)`}
            type="button"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <div className="mx-2 h-4 w-px bg-white/30" />
          <span className="px-2 text-sm text-white">
            {Math.round(previewState.scale * 100)}%
          </span>
        </div>
        <button
          className={`
            rounded-lg bg-black/50 p-2 text-white
            hover:bg-white/20
          `}
          onClick={closePreview}
          title={`${t("close")} (Esc)`}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 预览图片 */}
      <div
        className="relative flex h-full w-full items-center justify-center"
        onMouseDown={handleMouseDown}
        style={{
          cursor:
            previewState.scale > 1
              ? isDragging
                ? "grabbing"
                : "grab"
              : "default",
        }}
      >
        <Image
          alt={alt}
          className="max-h-full max-w-full object-contain"
          draggable={false}
          height={600}
          src={src}
          style={{
            transform: `
              translate(${previewState.x}px, ${previewState.y}px) 
              scale(${previewState.scale}) 
              rotate(${previewState.rotate}deg)
            `,
            transition: isDragging ? "none" : "transform 0.3s ease",
          }}
          width={800}
        />
      </div>

      {/* 操作提示 */}
      <div
        className={`
          absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/50
          px-4 py-2 text-sm text-white
        `}
      >
        <div className="flex items-center gap-4">
          <span>{t("operations.wheelZoom")}</span>
          <span>{t("operations.dragMove")}</span>
          <span>{t("operations.keyRotate")}</span>
          <span>{t("operations.escClose")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {imageElement}
      {typeof window !== "undefined" &&
        previewModal &&
        createPortal(previewModal, document.body)}
    </>
  );
}

// 导出别名以保持一致性
export { ImageComponent as Image };
