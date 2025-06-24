"use client";

import { ReactPlugin } from "@stagewise-plugins/react";
import dynamic from "next/dynamic";

// stagewise toolbar 仅在开发环境下加载
const StagewiseToolbar = dynamic(
  () => import("@stagewise/toolbar-next").then((mod) => mod.StagewiseToolbar),
  { ssr: false }
);

export function StagewiseProvider() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />;
}
