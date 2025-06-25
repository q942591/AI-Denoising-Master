"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ImageIcon,
  Sparkles,
  Upload,
  XCircle,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { cn } from "~/lib/cn";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Image } from "~/ui/primitives/image";
import { Skeleton } from "~/ui/primitives/skeleton";

interface DenoiseResult {
  creditsUsed: number;
  outputUrl?: string;
  recordId: string;
  status: "completed" | "failed" | "processing";
  taskId: string;
}

interface GenerationRecord {
  completedAt: Date | null;
  createdAt: Date;
  creditConsumed: number;
  id: string;
  inputUrl: string;
  outputUrl: null | string;
  status: string;
  type: string;
}

export default function ImageDenoisePageClient() {
  const t = useTranslations("ImageDenoise");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<null | string>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DenoiseResult | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [generationRecords, setGenerationRecords] = useState<
    GenerationRecord[]
  >([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);

  // file selection handler
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // validate file type
      if (!file.type.startsWith("image/")) {
        setError(t("errors.invalidFormat"));
        return;
      }

      // validate file size (4MB)
      if (file.size > 4 * 1024 * 1024) {
        setError(t("errors.fileTooLarge"));
        return;
      }

      setError(null);
      setSelectedFile(file);

      // create preview url
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [t]
  );

  // drag and drop handlers
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (!file) return;

      // simulate file selection
      if (!file.type.startsWith("image/")) {
        setError(t("errors.invalidFormat"));
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        setError(t("errors.fileTooLarge"));
        return;
      }

      setError(null);
      setSelectedFile(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [t]
  );

  // upload and process image
  const handleProcess = async () => {
    if (!selectedFile) {
      setError(t("errors.noFileSelected"));
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // first upload the file
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", "image");

      const uploadResponse = await fetch("/api/upload", {
        body: formData,
        method: "POST",
      });

      if (!uploadResponse.ok) {
        throw new Error(t("errors.uploadFailed"));
      }

      const uploadResult = (await uploadResponse.json()) as { url: string };
      setIsUploading(false);
      setIsProcessing(true);

      // then start denoising process
      const denoiseResponse = await fetch("/api/image-denoise", {
        body: JSON.stringify({
          imageUrl: uploadResult.url,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!denoiseResponse.ok) {
        const errorData = (await denoiseResponse.json()) as {
          currentBalance?: number;
          error?: string;
          required?: number;
        };
        if (denoiseResponse.status === 402) {
          throw new Error(
            t("errors.insufficientCredits") +
              (errorData.currentBalance !== undefined
                ? ` (当前余额: ${errorData.currentBalance}, 需要: ${errorData.required})`
                : "")
          );
        }
        throw new Error(errorData.error || t("errors.denoiseFailed"));
      }

      const denoiseResult = (await denoiseResponse.json()) as DenoiseResult;
      setResult(denoiseResult);

      // poll for completion
      pollTaskStatus(denoiseResult.taskId);
    } catch (err) {
      console.error("Processing error:", err);
      setError(err instanceof Error ? err.message : t("errors.denoiseFailed"));
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  // poll task status
  const pollTaskStatus = async (taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/image-denoise?taskId=${taskId}`);
        if (!response.ok) {
          throw new Error("Failed to check status");
        }

        const status = (await response.json()) as Partial<DenoiseResult>;
        setResult((prev) =>
          prev ? { ...prev, ...status } : (status as DenoiseResult)
        );

        if (status.status === "completed" || status.status === "failed") {
          clearInterval(pollInterval);
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(pollInterval);
        setIsProcessing(false);
        setError(t("errors.denoiseFailed"));
      }
    }, 3000); // poll every 3 seconds

    // stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isProcessing) {
        setIsProcessing(false);
        setError("Processing timeout");
      }
    }, 300000);
  };

  // reset to start over
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setIsUploading(false);
    setIsProcessing(false);
  };

  // download result
  const handleDownload = () => {
    if (result?.outputUrl && typeof window !== "undefined") {
      const link = document.createElement("a");
      link.href = result.outputUrl;
      link.download = `denoised_${selectedFile?.name || "image.jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // fetch user generation records
  useEffect(() => {
    const fetchGenerationRecords = async () => {
      try {
        setIsLoadingRecords(true);
        const response = await fetch("/api/generations");
        if (response.ok) {
          const records = (await response.json()) as GenerationRecord[];
          setGenerationRecords(records);
        }
      } catch (error) {
        console.error("Failed to fetch generation records:", error);
      } finally {
        setIsLoadingRecords(false);
      }
    };

    fetchGenerationRecords();
  }, []); // only fetch once on mount

  // refetch records when a new result is completed
  useEffect(() => {
    if (result?.status === "completed") {
      const refetchRecords = async () => {
        try {
          const response = await fetch("/api/generations");
          if (response.ok) {
            const records = (await response.json()) as GenerationRecord[];
            setGenerationRecords(records);
          }
        } catch (error) {
          console.error("Failed to refetch generation records:", error);
        }
      };
      refetchRecords();
    }
  }, [result?.status]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div
        className={`
          grid gap-8
          lg:grid-cols-2
        `}
      >
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {t("uploadArea.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedFile ? (
              <div
                className={cn(
                  `
                    cursor-pointer rounded-lg border-2 border-dashed p-8
                    text-center transition-colors duration-200
                    hover:border-primary/50 hover:bg-primary/5
                  `,
                  error ? "border-destructive" : "border-muted-foreground/25"
                )}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    document.getElementById("file-input")?.click();
                  }
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  accept="image/*"
                  className="hidden"
                  id="file-input"
                  onChange={handleFileSelect}
                  type="file"
                />

                <div className="space-y-4">
                  <div className="text-4xl">🖼️</div>
                  <div>
                    <p className="text-lg font-medium">
                      {t("uploadArea.dragText")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("uploadArea.description")}
                    </p>
                  </div>
                  <Button variant="outline">
                    {t("uploadArea.selectButton")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {previewUrl && (
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      alt="Preview"
                      className="aspect-video w-full object-contain"
                      height={300}
                      src={previewUrl}
                      width={500}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button onClick={handleReset} variant="outline">
                    Change File
                  </Button>
                </div>

                {error && (
                  <div
                    className={`
                      rounded-lg bg-destructive/10 p-3 text-sm text-destructive
                    `}
                  >
                    {error}
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={isUploading || isProcessing}
                  onClick={handleProcess}
                >
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      {t("processing.uploading")}
                    </>
                  ) : isProcessing ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      {t("processing.denoising")}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Denoising
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t("result.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !isProcessing && !isUploading ? (
              <div
                className={`
                  flex h-64 items-center justify-center rounded-lg border-2
                  border-dashed border-muted-foreground/25
                `}
              >
                <div className="text-center text-muted-foreground">
                  <Sparkles className="mx-auto mb-2 h-8 w-8" />
                  <p>Processing result will appear here</p>
                </div>
              </div>
            ) : (isUploading || isProcessing) && !result ? (
              <div className="space-y-4">
                {/* 状态标签占位 */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* 图片对比占位 */}
                <div
                  className={`
                    grid gap-4
                    md:grid-cols-2
                  `}
                >
                  <div>
                    <Skeleton className="mb-2 h-4 w-16" />
                    <Skeleton className="aspect-square w-full rounded-lg" />
                  </div>
                  <div>
                    <Skeleton className="mb-2 h-4 w-16" />
                    <Skeleton className="aspect-square w-full rounded-lg" />
                  </div>
                </div>

                {/* 按钮占位 */}
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    className="flex items-center gap-1"
                    variant={
                      result.status === "completed"
                        ? "primary"
                        : result.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {result.status === "completed" && (
                      <CheckCircle className={`h-3 w-3`} />
                    )}
                    {result.status === "failed" && (
                      <XCircle className="h-3 w-3" />
                    )}
                    {result.status === "processing" && (
                      <Clock className={`h-3 w-3 animate-spin`} />
                    )}
                    {result.status === "completed"
                      ? t("processing.completed")
                      : result.status === "failed"
                      ? t("processing.failed")
                      : t("processing.denoising")}
                  </Badge>

                  {result.creditsUsed && (
                    <span className="text-sm text-muted-foreground">
                      {t("result.creditsUsed", { credits: result.creditsUsed })}
                    </span>
                  )}
                </div>

                {/* Results Comparison */}
                {result.status === "completed" && result.outputUrl && (
                  <div className="space-y-4">
                    <div
                      className={`
                        grid gap-4
                        md:grid-cols-2
                      `}
                    >
                      {/* Original */}
                      <div>
                        <p className="mb-2 text-sm font-medium">
                          {t("result.original")}
                        </p>
                        {previewUrl && (
                          <div className="overflow-hidden rounded-lg">
                            <Image
                              alt="Original"
                              className="aspect-square w-full object-cover"
                              height={250}
                              src={previewUrl}
                              width={250}
                            />
                          </div>
                        )}
                      </div>

                      {/* Denoised */}
                      <div>
                        <p className="mb-2 text-sm font-medium">
                          {t("result.denoised")}
                        </p>
                        <div className="overflow-hidden rounded-lg">
                          <Image
                            alt="Denoised"
                            className="aspect-square w-full object-cover"
                            height={250}
                            src={result.outputUrl}
                            width={250}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        {t("result.download")}
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleReset}
                        variant="outline"
                      >
                        {t("result.processAgain")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Processing State */}
                {result.status === "processing" && (
                  <div className="space-y-4">
                    {/* 处理中的图片对比占位 */}
                    <div
                      className={`
                        grid gap-4
                        md:grid-cols-2
                      `}
                    >
                      <div>
                        <p className="mb-2 text-sm font-medium">
                          {t("result.original")}
                        </p>
                        {previewUrl ? (
                          <div className="overflow-hidden rounded-lg">
                            <Image
                              alt="Original"
                              className="aspect-square w-full object-cover"
                              height={250}
                              src={previewUrl}
                              width={250}
                            />
                          </div>
                        ) : (
                          <Skeleton className="aspect-square w-full rounded-lg" />
                        )}
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-medium">
                          {t("result.denoised")}
                        </p>
                        <div className="relative">
                          <Skeleton className="aspect-square w-full rounded-lg" />
                          <div
                            className={`
                              absolute inset-0 flex items-center justify-center
                            `}
                          >
                            <div className="text-center">
                              <Sparkles
                                className={`
                                  mx-auto mb-2 h-8 w-8 animate-pulse
                                  text-primary
                                `}
                              />
                              <p className="text-sm text-muted-foreground">
                                AI 处理中...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 按钮占位 */}
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                )}

                {/* Error State */}
                {result.status === "failed" && (
                  <div className="py-8 text-center">
                    <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                    <p className="mb-4 text-destructive">
                      Processing failed. Please try again.
                    </p>
                    <Button onClick={handleReset} variant="outline">
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("features.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`
              grid gap-4
              md:grid-cols-2
              lg:grid-cols-4
            `}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{t("features.aiPowered")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("features.aiPoweredDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{t("features.highQuality")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("features.highQualityDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{t("features.fastProcessing")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("features.fastProcessingDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{t("features.multiFormat")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("features.multiFormatDesc")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Gallery */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Your Generated Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRecords ? (
            <div
              className={`
                grid gap-4
                md:grid-cols-2
                lg:grid-cols-3
              `}
            >
              {[...Array(6)].map((_, i) => (
                <div className="space-y-2" key={i}>
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : generationRecords.length > 0 ? (
            <div
              className={`
                grid gap-4
                md:grid-cols-2
                lg:grid-cols-3
              `}
            >
              {generationRecords.map((record) => (
                <div className="group relative" key={record.id}>
                  <div
                    className={`
                      aspect-square overflow-hidden rounded-lg bg-muted
                    `}
                  >
                    <Image
                      alt="Generated image"
                      className={`
                        h-full w-full object-cover transition-transform
                        group-hover:scale-105
                      `}
                      height={300}
                      src={record.outputUrl || record.inputUrl}
                      width={300}
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {record.type === "super_resolution"
                          ? "Super Resolution"
                          : "Denoising"}
                      </Badge>
                      <div
                        className={`
                          flex items-center gap-1 text-xs text-muted-foreground
                        `}
                      >
                        <Calendar className="h-3 w-3" />
                        {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Credits used: {record.creditConsumed}
                    </p>
                  </div>
                  {record.outputUrl && (
                    <Button
                      className={`
                        absolute top-2 right-2 opacity-0 transition-opacity
                        group-hover:opacity-100
                      `}
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          const link = document.createElement("a");
                          link.href = record.outputUrl!;
                          link.download = `generated_${record.id}.jpg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                      size="sm"
                      variant="secondary"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <ImageIcon
                className={`mx-auto mb-4 h-12 w-12 text-muted-foreground`}
              />
              <p className="text-muted-foreground">
                No generated images yet. Start by uploading an image above!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
