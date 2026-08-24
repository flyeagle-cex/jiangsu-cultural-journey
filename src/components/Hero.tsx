import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Compass } from "lucide-react";

import { JiangsuMapExplorer } from "@/components/JiangsuMapExplorer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function Hero() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden bg-[#5E6C82] pt-16 text-[#EAF1F9]"
      id="explore"
    >
      {/* 运河背景图
          关键修改：
          不再限制 h-[680px]，而是覆盖整个 Hero。
      */}
      <img
        alt=""
        aria-hidden="true"
        className="hero-water-image absolute inset-0 h-full w-full object-cover opacity-35"
        height="611"
        src="/assets/hero-grand-canal.jpg"
        width="1269"
      />

      {/* 主色遮罩
          运河蓝 → 青绿色 → 浅水青
      */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0
          bg-[linear-gradient(110deg,rgba(66,118,157,0.96)_0%,rgba(94,108,130,0.90)_28%,rgba(129,179,169,0.82)_67%,rgba(193,221,219,0.70)_100%)]
        "
      />

      {/* 顶部略微加深，保证导航和主标题层次 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-x-0 top-0 h-[45%]
          bg-[linear-gradient(180deg,rgba(28,65,82,0.30)_0%,rgba(28,65,82,0.08)_60%,rgba(28,65,82,0)_100%)]
        "
      />

      {/* 左侧暖金环境光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-24 top-24
          h-80 w-80 rounded-full
          bg-[#EAC459]/14
          blur-3xl
        "
      />

      {/* 右侧珊瑚暖光
          很淡，只负责中和整页冷色
      */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute right-[5%] top-20
          h-72 w-72 rounded-full
          bg-[#F09C77]/8
          blur-3xl
        "
      />

      {/* 中部浅青柔光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-[40%] top-[36%]
          h-72 w-72 rounded-full
          bg-[#BAD6C7]/10
          blur-3xl
        "
      />

      {/* 原有水流纹理 */}
      <div
        aria-hidden="true"
        className="deep-water-currents opacity-55"
      />

      {/* Hero 内容 */}
      <div
        className="
          relative z-10
          mx-auto max-w-[1440px]
          px-4 pb-28 pt-12
          sm:px-6 sm:pb-32
          lg:px-10 lg:pb-36 lg:pt-16
        "
      >
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* 左侧文案 */}
          <motion.div
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="lg:col-span-5 lg:sticky lg:top-28 lg:pt-10"
            initial={{
              opacity: reduceMotion ? 1 : 0,
              y: reduceMotion ? 0 : 18,
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
          >
            {/* 顶部小标题 */}
            <p
              className="
                flex items-center gap-3
                text-xs font-semibold uppercase
                tracking-[0.2em]
                text-[#EAC459]
              "
            >
              <span
                aria-hidden="true"
                className="h-px w-12 bg-[#EAC459]/70"
              />

              {language === "zh"
                ? "江苏水志 · 中国江苏"
                : "Jiangsu water atlas · Jiangsu, China"}
            </p>

            {/* 主标题 */}
            <h1
              className={cn(
                "mt-8 font-display font-semibold leading-[0.92] tracking-[-0.045em] text-[#EAF1F9]",
                "drop-shadow-[0_3px_18px_rgba(26,63,82,0.22)]",
                language === "zh"
                  ? "max-w-[10ch] text-[clamp(3.5rem,6.8vw,7rem)]"
                  : "max-w-[12ch] text-[clamp(3.1rem,6vw,6.4rem)]",
              )}
            >
              {language === "zh"
                ? "水韵江苏"
                : "Jiangsu Cultural Journey"}
            </h1>

            {/* 中英文副标题 */}
            <p
              className="
                mt-5 max-w-[17ch]
                font-display
                text-[clamp(1.65rem,3vw,3.1rem)]
                font-light
                leading-[1.08]
                tracking-[-0.03em]
                text-[#C1DDDB]
              "
            >
              {language === "zh"
                ? "Jiangsu Cultural Journey"
                : "水韵江苏"}
            </p>

            {/* 宣传语 */}
            <p
              className="
                mt-9 max-w-[38rem]
                text-lg font-medium
                leading-8
                text-[#EAF1F9]
              "
            >
              {language === "zh"
                ? "一水贯十三城，一城一故事。"
                : "Explore Jiangsu through water, cities and stories."}
            </p>

            {/* 补充说明 */}
            <p
              className="
                mt-3 max-w-[35rem]
                text-base leading-7
                text-[#D1DED7]
              "
            >
              {language === "zh"
                ? "循着长江、运河与湖海的水脉，认识江苏的园林、手艺、风物与人。"
                : "Follow the Yangtze, the Grand Canal, lakes and coastlines into gardens, living crafts, local food and everyday stories."}
            </p>

            {/* 按钮 */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button
                asChild
                className="
                  h-11 rounded-full
                  border border-[#F2D77C]/45
                  bg-[#EAC459]
                  px-6
                  font-semibold
                  text-[#425E70]
                  shadow-[0_8px_28px_rgba(46,82,99,0.20)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#F0CF72]
                  hover:text-[#425E70]
                  hover:shadow-[0_12px_34px_rgba(234,196,89,0.18)]
                "
              >
                <a href="#cities">
                  <Compass aria-hidden="true" />

                  {language === "zh"
                    ? "从地图出发"
                    : "Start with the map"}
                </a>
              </Button>

              <a
                className="
                  inline-flex min-h-11 items-center gap-2
                  border-b border-[#D6CDBE]/65
                  px-1
                  text-sm font-semibold
                  text-[#EAF1F9]
                  outline-none
                  transition-colors
                  hover:border-[#EAC459]
                  hover:text-[#FFF6DD]
                  focus-visible:ring-2
                  focus-visible:ring-[#EAC459]
                "
                href="#themes"
              >
                {language === "zh"
                  ? "按主题探索"
                  : "Explore by theme"}

                <ArrowDown
                  aria-hidden="true"
                  className="size-4"
                />
              </a>
            </div>

            {/* 数据标签 */}
            <p
              className="
                mt-12
                border-l-2
                border-[#EAC459]/75
                pl-4
                text-xs font-semibold uppercase
                tracking-[0.18em]
                text-[#D1DED7]
              "
            >
              {language === "zh"
                ? "13 城市 · 5 条文化水路"
                : "13 cities · 5 cultural currents"}
            </p>
          </motion.div>

          {/* 江苏地图 */}
          <motion.div
            animate={{
              opacity: 1,
            }}
            className="lg:col-span-7"
            initial={{
              opacity: reduceMotion ? 1 : 0,
            }}
            transition={{
              delay: reduceMotion ? 0 : 0.12,
              duration: 0.55,
            }}
          >
            <JiangsuMapExplorer />
          </motion.div>
        </div>
      </div>

      {/* 
          Hero 底部过渡

          这里是这次最重要的设计：
          不再出现大片纯白。

          只在底部最后一小段：
          浅水青 → 雾白蓝 → 暖沙色

          之后再进入水波。
      */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-x-0 bottom-0
          h-40 sm:h-48 lg:h-56
          bg-[linear-gradient(180deg,rgba(193,221,219,0)_0%,rgba(193,221,219,0.18)_25%,rgba(234,241,249,0.52)_62%,rgba(214,205,190,0.88)_100%)]
        "
      />

      {/* 底部水波 */}
      <div
        aria-hidden="true"
        className="ocean-foam-divider z-20"
      />
    </section>
  );
}