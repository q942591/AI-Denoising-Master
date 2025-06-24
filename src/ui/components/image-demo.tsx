"use client";

import { Image } from "~/ui/primitives/image";

export function ImageDemo() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Image 组件示例</h2>
        <p className="mb-6 text-gray-600">
          类似 Ant Design 的 Image 组件，支持预览、缩放、旋转等功能
        </p>
      </div>

      <div
        className={`
        grid grid-cols-1 gap-8
        md:grid-cols-2
        lg:grid-cols-3
      `}
      >
        {/* 基础用法 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">基础用法</h3>
          <Image
            alt="Logo"
            className="rounded-lg border"
            height={200}
            src="/logo.png"
            width={200}
          />
          <p className="text-sm text-gray-500">
            默认开启预览功能，点击图片可放大查看
          </p>
        </div>

        {/* 禁用预览 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">禁用预览</h3>
          <Image
            alt="Placeholder"
            className="rounded-lg border"
            height={200}
            preview={false}
            src="/placeholder.svg"
            width={200}
          />
          <p className="text-sm text-gray-500">
            设置 preview={`{false}`} 禁用预览功能
          </p>
        </div>

        {/* 错误处理 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">错误处理</h3>
          <Image
            alt="Error Image"
            className="rounded-lg border"
            fallback="/placeholder.svg"
            height={200}
            onError={() => console.log("图片加载失败")}
            src="/non-existent-image.jpg"
            width={200}
          />
          <p className="text-sm text-gray-500">
            图片加载失败时显示 fallback 图片
          </p>
        </div>

        {/* 自定义大小 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">自定义大小</h3>
          <Image
            alt="Custom Size"
            className="rounded-lg border object-cover"
            height={100}
            src="/logo.png"
            width={150}
          />
          <p className="text-sm text-gray-500">可以设置任意宽高</p>
        </div>

        {/* 响应式 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">响应式</h3>
          <Image
            alt="Responsive"
            className="w-full max-w-xs rounded-lg border object-cover"
            height={200}
            src="/logo.png"
            width={300}
          />
          <p className="text-sm text-gray-500">结合 CSS 类实现响应式布局</p>
        </div>

        {/* 带回调 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">事件回调</h3>
          <Image
            alt="With Callbacks"
            className="rounded-lg border"
            height={200}
            onClick={() => console.log("图片被点击")}
            onLoad={() => console.log("图片加载完成")}
            src="/logo.png"
            width={200}
          />
          <p className="text-sm text-gray-500">
            支持 onLoad、onError、onClick 回调
          </p>
        </div>
      </div>

      <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
        <h4 className="font-semibold text-blue-900">预览功能说明</h4>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>• 点击图片进入预览模式</li>
          <li>• 使用鼠标滚轮或工具栏按钮缩放</li>
          <li>• 拖拽可移动图片位置（放大后）</li>
          <li>• 方向键或工具栏按钮旋转图片</li>
          <li>• 按 ESC 键或点击关闭按钮退出预览</li>
          <li>• 键盘快捷键：+/- 缩放，方向键旋转</li>
        </ul>
      </div>
    </div>
  );
}
