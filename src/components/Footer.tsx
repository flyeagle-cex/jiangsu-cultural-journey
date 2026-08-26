import { Waves } from "lucide-react";
import { Link } from "react-router-dom";

import { useLanguage } from "@/context/LanguageContext";
import { BRAND_NAME, BRAND_SLOGAN } from "@/data/brand";

const footerLinks = [
  { to: "/#explore", zh: "探索", en: "Explore" },
  { to: "/#cities", zh: "十三城", en: "Cities" },
  { to: "/#canal", zh: "大运河", en: "Grand Canal" },
  { to: "/#heritage", zh: "非遗", en: "Heritage" },
  { to: "/#food", zh: "美食", en: "Food" },
  { to: "/#about", zh: "关于", en: "About" },
] as const;

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer
      className="
        relative overflow-hidden
        border-t border-[#C1DDDB]/18
        bg-[linear-gradient(180deg,#45636F_0%,#3B5663_55%,#334B57_100%)]
        text-[#EAF1F9]
      "
      id="about"
    >
      {/* 左侧暖金环境光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-24 top-[-40px]
          h-72 w-72
          rounded-full
          bg-[#EAC459]/9
          blur-3xl
        "
      />

      {/* 右侧水青环境光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute right-[-6%] top-4
          h-80 w-80
          rounded-full
          bg-[#81B3A9]/10
          blur-3xl
        "
      />

      {/* 中部极淡珊瑚暖光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-[48%] top-[15%]
          h-56 w-56
          rounded-full
          bg-[#F09C77]/5
          blur-3xl
        "
      />

      <div
        className="
          relative z-10
          mx-auto grid max-w-[1440px]
          gap-10
          px-4 py-14
          sm:px-6
          md:grid-cols-12
          lg:px-10
        "
      >
        {/* 品牌区域 */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            {/* 图标 */}
            <span
              className="
                flex size-10
                items-center justify-center
                rounded-full
                border border-[#EAC459]/30
                bg-[#EAC459]/8
              "
            >
              <Waves
                aria-hidden="true"
                className="size-5 text-[#EAC459]"
              />
            </span>

            {/* 品牌名称 */}
            <p
              className="
                font-display
                text-xl font-semibold
                text-[#F2F5F3]
              "
            >
              {BRAND_NAME[language]}
            </p>
          </div>

          <p className="mt-4 font-display text-base tracking-wide text-[#EAC459]">
            {BRAND_SLOGAN[language]}
          </p>

          {/* 简介 */}
          <p
            className="
              mt-5 max-w-lg
              text-sm leading-6
              text-[#D1DED7]
            "
          >
            {language === "zh"
              ? "面向国际学生的江苏双语数字文化导览。循着江河湖海，认识十三城的风物、手艺与日常。"
              : "A bilingual digital cultural guide to Jiangsu for international students, connecting the landscapes, crafts and everyday stories of thirteen cities through water."}
          </p>

          {/* 装饰线 */}
          <div
            aria-hidden="true"
            className="mt-7 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-[#EAC459]/65" />

            <span className="size-1.5 rounded-full bg-[#EAC459]/80" />

            <span className="h-px w-16 bg-[#81B3A9]/50" />

            <span className="size-1 rounded-full bg-[#F09C77]/65" />
          </div>
        </div>

        {/* 页脚导航 */}
        <nav
          aria-label={
            language === "zh"
              ? "页脚导航"
              : "Footer navigation"
          }
          className="
            grid grid-cols-2
            gap-x-8 gap-y-4
            text-sm
            md:col-span-4
            md:col-start-8
          "
        >
          {footerLinks.map((link) => (
            <Link
              className="
                group
                inline-flex w-fit
                items-center gap-2
                text-[#D7E2DE]
                transition-all duration-200

                hover:translate-x-0.5
                hover:text-[#EAC459]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#EAC459]/70
              "
              key={link.to}
              to={link.to}
            >
              {/* 小圆点 */}
              <span
                aria-hidden="true"
                className="
                  size-1.5
                  rounded-full
                  bg-[#81B3A9]/75
                  transition-all duration-200

                  group-hover:bg-[#EAC459]
                  group-hover:shadow-[0_0_10px_rgba(234,196,89,0.45)]
                "
              />

              {link[language]}
            </Link>
          ))}
        </nav>
      </div>

      {/* 底部版权区域 */}
      <div
        className="
          relative z-10
          border-t border-[#C1DDDB]/14
          px-4 py-5
          text-center
          text-xs
          text-[#B3C6BB]
        "
      >
        {language === "zh"
          ? `© 2026 ${BRAND_NAME.zh} · 文化创新比赛 MVP`
          : `© 2026 ${BRAND_NAME.en} · Cultural innovation showcase MVP`}
      </div>
    </footer>
  );
}
