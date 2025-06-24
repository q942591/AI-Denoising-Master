"use client";

import { useState } from "react";

import { Button } from "~/ui/primitives/button";

interface FileUploadProps {
  className?: string;
  maxFiles?: number;
  onUploadComplete?: (result: any) => void;
  type: "image" | "video";
}

export function FileUpload({
  className,
  maxFiles = 10,
  onUploadComplete,
  type,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files)
        .slice(0, maxFiles)
        .map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", type);

          const response = await fetch("/api/upload", {
            body: formData,
            method: "POST",
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          return response.json();
        });

      const results = await Promise.all(uploadPromises);
      onUploadComplete?.(results);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const acceptedTypes = type === "image" ? "image/*" : "video/*";

  const maxSize = type === "image" ? "4MB" : "64MB";

  return (
    <div className={className}>
      <div
        className={`
          relative rounded-lg border-2 border-dashed p-6 text-center
          transition-colors duration-200
          ${
            dragOver
              ? "border-primary bg-primary/5"
              : `
                border-muted-foreground/25
                hover:border-muted-foreground/50
              `
          }
          ${uploading ? "pointer-events-none opacity-50" : ""}
        `}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          accept={acceptedTypes}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={uploading}
          multiple={maxFiles > 1}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          type="file"
        />

        <div className="space-y-4">
          <div className="text-4xl text-muted-foreground">
            {type === "image" ? "🖼️" : "🎬"}
          </div>

          <div>
            <p className="text-lg font-medium">
              Drop {type}s here or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Max {maxFiles} file{maxFiles > 1 ? "s" : ""}, up to {maxSize} each
            </p>
          </div>

          <Button
            className="pointer-events-none"
            disabled={uploading}
            type="button"
            variant="outline"
          >
            {uploading ? "Uploading..." : `Choose ${type}s`}
          </Button>
        </div>
      </div>
    </div>
  );
}
