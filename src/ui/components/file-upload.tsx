"use client";

import { useState } from "react";
import { Button } from "~/ui/primitives/button";

interface FileUploadProps {
  type: "image" | "video";
  onUploadComplete?: (result: any) => void;
  maxFiles?: number;
  className?: string;
}

export function FileUpload({
  type,
  onUploadComplete,
  maxFiles = 10,
  className,
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
            method: "POST",
            body: formData,
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
          relative border-2 border-dashed rounded-lg p-6 text-center
          transition-colors duration-200
          ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }
          ${uploading ? "opacity-50 pointer-events-none" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={acceptedTypes}
          multiple={maxFiles > 1}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
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
            type="button"
            variant="outline"
            disabled={uploading}
            className="pointer-events-none"
          >
            {uploading ? "Uploading..." : `Choose ${type}s`}
          </Button>
        </div>
      </div>
    </div>
  );
}
