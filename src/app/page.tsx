"use client";

import {
  ArrowRight,
  Clock,
  Download,
  Shield,
  Sparkles,
  Star,
  Upload,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { ImageComparisonSlider } from "~/ui/components/image-comparison-slider";
import { Starfield } from "~/ui/components/starfield";
import { Button } from "~/ui/primitives/button";
import { Card } from "~/ui/primitives/card";

export default function HomePage() {
  const t = useTranslations("HomePage");

  const features = [
    {
      description: t("features.aiPowered.description"),
      icon: <Sparkles className="h-8 w-8 text-blue-500" />,
      title: t("features.aiPowered.title"),
    },
    {
      description: t("features.instantProcessing.description"),
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: t("features.instantProcessing.title"),
    },
    {
      description: t("features.qualityPreservation.description"),
      icon: <Star className="h-8 w-8 text-purple-500" />,
      title: t("features.qualityPreservation.title"),
    },
    {
      description: t("features.securePrivate.description"),
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: t("features.securePrivate.title"),
    },
  ];

  const howItWorksSteps = [
    {
      description: t("howItWorks.steps.upload.description"),
      icon: <Upload className="h-16 w-16" />,
      step: "01",
      title: t("howItWorks.steps.upload.title"),
    },
    {
      description: t("howItWorks.steps.process.description"),
      icon: <Sparkles className="h-16 w-16" />,
      step: "02",
      title: t("howItWorks.steps.process.title"),
    },
    {
      description: t("howItWorks.steps.download.description"),
      icon: <Download className="h-16 w-16" />,
      step: "03",
      title: t("howItWorks.steps.download.title"),
    },
  ];

  return (
    <>
      <main
        className={`
          min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
          dark:from-black dark:via-gray-950 dark:to-slate-950
        `}
      >
        {/* Hero Section with Starfield */}
        <section
          className={`
            relative flex min-h-screen items-center justify-center
            overflow-hidden
          `}
        >
          <Starfield
            className={`
              opacity-30
              dark:opacity-60
            `}
          />

          {/* Animated background gradient */}
          <div
            className={`
              absolute inset-0 animate-pulse bg-gradient-to-r from-blue-200/30
              via-purple-200/30 to-pink-200/30
              dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20
            `}
          />

          {/* Floating particles animation */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                className={`
                  absolute animate-bounce rounded-full bg-gray-400/20
                  dark:bg-white/10
                `}
                key={i}
                style={{
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  height: `${Math.random() * 8 + 4}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 4}px`,
                }}
              />
            ))}
          </div>

          <div
            className={`
              relative z-10 container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="space-y-8 text-center">
              {/* Badge with animation */}
              <div className="animate-fadeInUp">
                <div
                  className={`
                    inline-flex items-center gap-2 rounded-full border
                    border-gray-300/40 bg-gray-100/80 px-4 py-2 text-gray-800
                    backdrop-blur-sm
                    dark:border-white/20 dark:bg-white/10 dark:text-white
                  `}
                >
                  <Sparkles
                    className={`
                      h-4 w-4 animate-spin text-blue-600
                      dark:text-blue-400
                    `}
                  />
                  {t("hero.badge")}
                </div>
              </div>

              {/* Main heading with gradient text */}
              <div className="animate-fadeInUp animation-delay-200">
                <h1
                  className={`
                    text-6xl font-bold tracking-tight
                    md:text-8xl
                  `}
                >
                  <span
                    className={`
                      bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700
                      bg-clip-text text-transparent
                      dark:from-white dark:via-blue-200 dark:to-purple-200
                    `}
                  >
                    {t("hero.title")}
                  </span>
                  <br />
                  <span
                    className={`
                      animate-pulse bg-gradient-to-r from-blue-600
                      via-purple-600 to-pink-600 bg-clip-text text-transparent
                      dark:from-blue-400 dark:via-purple-400 dark:to-pink-400
                    `}
                  >
                    {t("hero.titleHighlight")}
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className="animate-fadeInUp animation-delay-400">
                <p
                  className={`
                    mx-auto max-w-4xl text-xl leading-relaxed text-gray-700
                    md:text-2xl
                    dark:text-blue-100
                  `}
                >
                  {t("hero.subtitle")}
                </p>
              </div>

              {/* Feature badges */}
              <div className="animate-fadeInUp animation-delay-600">
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div
                    className={`
                      flex items-center gap-2 rounded-full border
                      border-gray-300/40 bg-gray-100/80 px-4 py-2 text-gray-800
                      backdrop-blur-sm
                      dark:border-white/20 dark:bg-white/10 dark:text-white
                    `}
                  >
                    <Clock
                      className={`
                        h-4 w-4 text-blue-600
                        dark:text-blue-400
                      `}
                    />
                    {t("hero.features.instant")}
                  </div>
                  <div
                    className={`
                      flex items-center gap-2 rounded-full border
                      border-gray-300/40 bg-gray-100/80 px-4 py-2 text-gray-800
                      backdrop-blur-sm
                      dark:border-white/20 dark:bg-white/10 dark:text-white
                    `}
                  >
                    <Star
                      className={`
                        h-4 w-4 text-purple-600
                        dark:text-purple-400
                      `}
                    />
                    {t("hero.features.highQuality")}
                  </div>
                  <div
                    className={`
                      flex items-center gap-2 rounded-full border
                      border-gray-300/40 bg-gray-100/80 px-4 py-2 text-gray-800
                      backdrop-blur-sm
                      dark:border-white/20 dark:bg-white/10 dark:text-white
                    `}
                  >
                    <Shield
                      className={`
                        h-4 w-4 text-green-600
                        dark:text-green-400
                      `}
                    />
                    {t("hero.features.secure")}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="animate-fadeInUp animation-delay-800">
                <div
                  className={`
                    flex flex-col justify-center gap-4
                    sm:flex-row
                  `}
                >
                  <Link href="/generate">
                    <Button
                      className={`
                        h-14 transform bg-gradient-to-r from-blue-600
                        to-purple-600 px-8 text-lg shadow-lg transition-all
                        duration-300
                        hover:scale-105 hover:from-blue-700 hover:to-purple-700
                        hover:shadow-xl
                      `}
                      size="lg"
                    >
                      {t("hero.cta.primary")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/examples">
                    <Button
                      className={`
                        h-14 transform border-gray-300 px-8 text-lg
                        text-gray-800 transition-all duration-300
                        hover:scale-105 hover:bg-gray-100
                        dark:border-white/30 dark:text-white
                        dark:hover:bg-white/10
                      `}
                      size="lg"
                      variant="outline"
                    >
                      {t("hero.cta.secondary")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className={`
              absolute bottom-8 left-1/2 -translate-x-1/2 transform
              animate-bounce
            `}
          >
            <div
              className={`
                flex h-10 w-6 justify-center rounded-full border-2
                border-gray-400/40
                dark:border-white/30
              `}
            >
              <div
                className={`
                  mt-2 h-3 w-1 animate-pulse rounded-full bg-gray-500/60
                  dark:bg-white/50
                `}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className={`
            bg-gradient-to-br from-white via-blue-50 to-purple-50 py-24
            dark:from-black dark:via-gray-950 dark:to-slate-950
          `}
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="mb-16 text-center">
              <h2
                className={`
                  mb-4 text-4xl font-bold text-gray-900
                  md:text-5xl
                  dark:text-white
                `}
              >
                {t("features.title")}
              </h2>
              <p
                className={`
                  mx-auto max-w-3xl text-xl text-gray-600
                  dark:text-gray-300
                `}
              >
                {t("features.subtitle")}
              </p>
            </div>

            <div
              className={`
                grid grid-cols-1 gap-6
                md:grid-cols-2
                lg:grid-cols-4
              `}
            >
              {features.map((feature, index) => (
                <div
                  className="group relative h-full"
                  key={feature.title}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card
                    className={`
                      flex h-full min-h-[280px] transform flex-col border-0
                      bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all
                      duration-300
                      group-hover:bg-white
                      hover:scale-105 hover:shadow-xl
                      dark:bg-gray-900/90 dark:group-hover:bg-gray-900
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                        mb-4 flex h-14 w-14 flex-shrink-0 items-center
                        justify-center rounded-xl bg-gradient-to-br
                        from-blue-100 to-purple-100 transition-all duration-300
                        group-hover:from-blue-200 group-hover:to-purple-200
                        dark:from-blue-900/50 dark:to-purple-900/50
                        dark:group-hover:from-blue-800/60
                        dark:group-hover:to-purple-800/60
                      `}
                    >
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3
                      className={`
                        mb-3 text-lg leading-tight font-semibold text-gray-900
                        dark:text-white
                      `}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`
                        flex-1 text-sm leading-relaxed text-gray-600
                        dark:text-gray-300
                      `}
                    >
                      {feature.description}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={`relative bg-black py-24`}>
          {/* Starfield background */}
          <Starfield className={`opacity-40`} />

          <div
            className={`
              relative z-10 container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="mb-20 text-center">
              <h2
                className={`
                  mb-6 text-5xl font-bold text-white
                  md:text-6xl
                `}
              >
                {t("howItWorks.title")}
              </h2>
              <p className={`mx-auto max-w-3xl text-xl text-gray-400`}>
                {t("howItWorks.subtitle")}
              </p>
            </div>

            <div className={`relative mx-auto max-w-6xl`}>
              {/* Connection lines */}
              <div
                className={`
                  absolute top-32 right-0 left-0 hidden h-0.5
                  lg:block
                `}
              >
                <div
                  className={`
                    mx-auto flex h-full max-w-4xl items-center justify-between
                  `}
                >
                  <div
                    className={`
                      h-0.5 w-1/3 bg-gradient-to-r from-blue-500 to-purple-500
                    `}
                  />
                  <div className={`h-2 w-2 rounded-full bg-purple-500`} />
                  <div
                    className={`
                      h-0.5 w-1/3 bg-gradient-to-r from-purple-500 to-green-500
                    `}
                  />
                </div>
              </div>

              <div
                className={`
                  grid grid-cols-1 gap-12
                  lg:grid-cols-3
                `}
              >
                {howItWorksSteps.map((step, index) => (
                  <div
                    className="group relative text-center"
                    key={step.step}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative z-10">
                      {/* Step number circle */}
                      <div
                        className={`
                          mb-8 inline-flex h-20 w-20 items-center justify-center
                          rounded-full bg-gradient-to-r text-2xl font-bold
                          text-white transition-transform duration-300
                          group-hover:scale-110
                          ${
                            index === 0
                              ? "from-blue-500 to-blue-600"
                              : index === 1
                              ? "from-purple-500 to-purple-600"
                              : "from-green-500 to-green-600"
                          }
                        `}
                      >
                        {step.step}
                      </div>

                      {/* Icon container */}
                      <div className={`mb-8 flex justify-center`}>
                        <div
                          className={`
                            rounded-2xl border border-gray-700 bg-gray-900/80
                            p-6 backdrop-blur-sm transition-all duration-300
                            group-hover:border-gray-600
                            group-hover:bg-gray-800/90
                          `}
                        >
                          <div
                            className={`
                              ${
                                index === 0
                                  ? "text-blue-400"
                                  : index === 1
                                  ? "text-purple-400"
                                  : "text-green-400"
                              }
                            `}
                          >
                            {step.icon}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className={`mb-4 text-2xl font-bold text-white`}>
                        {step.title}
                      </h3>
                      <p className={`text-gray-400`}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section
          className={`
            bg-gradient-to-br from-white via-purple-50 to-pink-50 py-24
            dark:from-black dark:via-gray-950 dark:to-slate-950
          `}
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="mb-16 text-center">
              <h2
                className={`
                  mb-4 text-4xl font-bold text-gray-900
                  md:text-5xl
                  dark:text-white
                `}
              >
                {t("demo.title")}
              </h2>
              <p
                className={`
                  mx-auto max-w-3xl text-xl text-gray-600
                  dark:text-gray-300
                `}
              >
                {t("demo.subtitle")}
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              {/* 图像对比滑动组件 */}
              <div
                className={`
                  hover:shadow-3xl
                  mb-8 overflow-hidden rounded-2xl shadow-2xl transition-shadow
                  duration-300
                `}
              >
                <ImageComparisonSlider
                  afterAlt="高清修复后的图像"
                  afterImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&q=95"
                  afterLabel={t("demo.after")}
                  beforeAlt="原始低质量图像"
                  beforeImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=20"
                  beforeLabel={t("demo.before")}
                  className={`
                    h-96
                    md:h-[500px]
                  `}
                  dragToCompareText="拖拽滑动对比效果"
                  improvement="75%"
                />
              </div>

              <div className="mt-8 text-center">
                <Link href="/examples">
                  <Button
                    className={`
                      h-12 transform border-purple-300 px-8 text-lg
                      text-purple-700 transition-all duration-300
                      hover:scale-105 hover:bg-purple-50
                    `}
                    size="lg"
                    variant="outline"
                  >
                    {t("demo.viewMore")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          className={`
            bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 py-24
            dark:from-black dark:via-gray-950 dark:to-slate-950
          `}
        >
          <div
            className={`
              container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="mb-16 text-center">
              <h2
                className={`
                  mb-4 text-4xl font-bold text-gray-900
                  md:text-5xl
                  dark:text-white
                `}
              >
                {t("pricing.title")}
              </h2>
              <p
                className={`
                  mx-auto max-w-3xl text-xl text-gray-700
                  dark:text-blue-200
                `}
              >
                {t("pricing.subtitle")}
              </p>
            </div>

            <div className="text-center">
              <Link href="/pricing">
                <Button
                  className={`
                    h-14 transform bg-gradient-to-r from-purple-600 to-pink-600
                    px-8 text-lg shadow-lg transition-all duration-300
                    hover:scale-105 hover:from-purple-700 hover:to-pink-700
                    hover:shadow-xl
                  `}
                  size="lg"
                >
                  {t("pricing.viewAllPlans")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`
            relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
            py-24
          `}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div
            className={`
              relative z-10 container mx-auto max-w-7xl px-4
              sm:px-6
              lg:px-8
            `}
          >
            <div className="space-y-8 text-center">
              <h2
                className={`
                  text-4xl font-bold text-white
                  md:text-6xl
                `}
              >
                {t("cta.title")}
              </h2>
              <p
                className={`
                  mx-auto max-w-3xl text-xl text-white/90
                  md:text-2xl
                `}
              >
                {t("cta.subtitle")}
              </p>
              <div
                className={`
                  flex flex-col justify-center gap-4
                  sm:flex-row
                `}
              >
                <Link href="/generate">
                  <Button
                    className={`
                      h-14 transform bg-white px-8 text-lg text-purple-600
                      shadow-lg transition-all duration-300
                      hover:scale-105 hover:bg-gray-100 hover:shadow-xl
                    `}
                    size="lg"
                  >
                    {t("cta.getStarted")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/examples">
                  <Button
                    className={`
                      h-14 transform border-white/30 px-8 text-lg text-white
                      transition-all duration-300
                      hover:scale-105 hover:bg-white/10
                    `}
                    size="lg"
                    variant="outline"
                  >
                    {t("cta.learnMore")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sample banner */}
        {/* <United24Banner animateGradient={false} /> */}
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </>
  );
}
