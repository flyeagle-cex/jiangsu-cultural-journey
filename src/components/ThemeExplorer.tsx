import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { themeItems } from "@/data/home";
import { cn } from "@/lib/utils";

const layoutClasses = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-8",
];

export function ThemeExplorer() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="
        relative scroll-mt-16 overflow-hidden
        bg-[linear-gradient(180deg,#5E6C82_0%,#587888_48%,#4F7F80_100%)]
        pb-24 pt-20
        text-[#EAF1F9]
        sm:pb-28 sm:pt-24
      "
      id="themes"
    >
      {/* 左侧暖金环境光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-28 top-10
          h-80 w-80 rounded-full
          bg-[#EAC459]/10
          blur-3xl
        "
      />

      {/* 右侧珊瑚暖光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute right-[-8%] top-[18%]
          h-96 w-96 rounded-full
          bg-[#F09C77]/7
          blur-3xl
        "
      />

      {/* 中下部水青光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-[-120px] left-[32%]
          h-96 w-96 rounded-full
          bg-[#81B3A9]/12
          blur-3xl
        "
      />

      {/* 右下浅青光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute bottom-[-80px] right-[8%]
          h-72 w-72 rounded-full
          bg-[#C1DDDB]/8
          blur-3xl
        "
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* 标题区域 */}
        <div
          className="
            grid gap-6
            border-b border-[#C1DDDB]/22
            pb-10
            md:grid-cols-12 md:items-end
          "
        >
          <div className="md:col-span-7">
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
                className="h-px w-10 bg-[#EAC459]/75"
              />

              {language === "zh"
                ? "五道文化水流"
                : "Five cultural currents"}
            </p>

            <h2
              className="
                mt-4
                font-display
                text-4xl font-semibold
                leading-tight
                text-[#EAF1F9]
                sm:text-5xl
              "
            >
              {language === "zh"
                ? "按主题，读懂江苏"
                : "Five ways into Jiangsu"}
            </h2>
          </div>

          <p
            className="
              max-w-xl
              text-base leading-7
              text-[#D1DED7]
              md:col-span-5
              md:justify-self-end
            "
          >
            {language === "zh"
              ? "不必按行政区逐页浏览。你也可以沿着运河、自然、历史、手艺和味道，跨城寻找彼此呼应的文化线索。"
              : "You do not have to travel city by city. Follow a theme across the province and see how waterways, landscapes, crafts and food connect."}
          </p>
        </div>

        {/* 主题卡片 */}
        <div
          className="
            mt-10 grid
            auto-rows-[270px]
            gap-px overflow-hidden
            border border-[#C1DDDB]/24
            bg-[#C1DDDB]/24
            md:grid-cols-12
            md:auto-rows-[280px]
          "
        >
          {themeItems.map((theme, index) => (
            <motion.a
              animate={{ opacity: 1 }}
              className={cn(
                `
                  group relative isolate overflow-hidden
                  bg-[#42769D]
                  outline-none
                  transition-all duration-300
                  hover:z-10
                  hover:shadow-[0_18px_50px_rgba(234,196,89,0.12)]
                  focus-visible:z-20
                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-[#EAC459]
                `,
                layoutClasses[index],
              )}
              href="#cities"
              id={theme.id}
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              key={theme.id}
              transition={{
                delay: reduceMotion ? 0 : index * 0.06,
                duration: 0.4,
              }}
            >
              {/* 图片 */}
              <img
                alt={theme.description[language]}
                className="
                  absolute inset-0 size-full
                  object-cover
                  opacity-[0.82]
                  transition-[opacity,filter,transform]
                  duration-500
                  group-hover:scale-[1.025]
                  group-hover:opacity-[0.9]
                  group-hover:saturate-[0.92]
                "
                height="900"
                loading="lazy"
                src={theme.image}
                width="1200"
              />

              {/* 图片色彩统一层 */}
              <span
                aria-hidden="true"
                className="
                  absolute inset-0
                  bg-[linear-gradient(135deg,rgba(66,118,157,0.30)_0%,rgba(129,179,169,0.16)_58%,rgba(240,156,119,0.07)_100%)]
                "
              />

              {/* 顶部轻微暗角，提高序号可读性 */}
              <span
                aria-hidden="true"
                className="
                  absolute inset-x-0 top-0 h-28
                  bg-[linear-gradient(180deg,rgba(48,77,94,0.35)_0%,rgba(48,77,94,0)_100%)]
                "
              />

              {/* 序号 */}
              <span
                className="
                  absolute left-5 top-5
                  flex items-center gap-2
                  text-xs font-semibold
                  tracking-[0.2em]
                  text-[#F2DF9C]
                "
              >
                <span className="h-px w-5 bg-[#EAC459]/80" />

                {String(index + 1).padStart(2, "0")}
              </span>

              {/* 底部信息区 */}
              <span
                className="
                  absolute inset-x-0 bottom-0
                  flex items-end justify-between
                  gap-5
                  border-t border-[#C1DDDB]/18
                  bg-[linear-gradient(180deg,rgba(75,103,119,0.70)_0%,rgba(70,96,111,0.94)_100%)]
                  p-5
                  backdrop-blur-[3px]
                  sm:p-6
                "
              >
                <span>
                  <span
                    className="
                      block
                      font-display
                      text-2xl font-semibold
                      text-[#F2F5F3]
                      sm:text-3xl
                    "
                  >
                    {theme.title[language]}
                  </span>

                  <span
                    className="
                      mt-2 block
                      max-w-md
                      text-sm leading-6
                      text-[#D6E0DB]
                    "
                  >
                    {theme.description[language]}
                  </span>
                </span>

                {/* 箭头 */}
                <span
                  className="
                    mb-1 flex size-9 shrink-0
                    items-center justify-center
                    rounded-full
                    border border-[#EAC459]/45
                    bg-[#EAC459]/10
                    transition-all duration-300
                    group-hover:border-[#EAC459]/80
                    group-hover:bg-[#EAC459]/22
                    group-hover:shadow-[0_0_18px_rgba(234,196,89,0.15)]
                  "
                >
                  <ArrowUpRight
                    aria-hidden="true"
                    className="
                      size-4
                      text-[#EAC459]
                      transition-transform duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </span>
              </span>
            </motion.a>
          ))}
        </div>

        {/* 底部微弱装饰 */}
        <div
          aria-hidden="true"
          className="mt-8 flex items-center justify-center gap-3 opacity-70"
        >
          <span className="h-px w-14 bg-[#81B3A9]/45" />
          <span className="size-1.5 rounded-full bg-[#EAC459]/70" />
          <span className="h-px w-14 bg-[#B3C6BB]/45" />
        </div>
      </div>
    </section>
  );
}