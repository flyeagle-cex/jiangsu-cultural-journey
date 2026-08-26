import { Menu, Waves } from "lucide-react";
import { Link } from "react-router-dom";

import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_NAME, BRAND_NAME_EN_UPPER } from "@/data/brand";

const navItems = [
  { to: "/#explore", zh: "探索", en: "Explore" },
  { to: "/#cities", zh: "十三城", en: "Cities" },
  { to: "/#canal", zh: "大运河", en: "Grand Canal" },
  { to: "/#heritage", zh: "非遗", en: "Heritage" },
  { to: "/#food", zh: "美食", en: "Food" },
  { to: "/creative", zh: "文创中心", en: "Creative" },
  { to: "/user", zh: "用户中心", en: "My Journey" },
  { to: "/#about", zh: "关于", en: "About" },
] as const;

export function Navbar() {
  const { language } = useLanguage();

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-40
        border-b border-[#C1DDDB]/18
        bg-[#395664]/90
        shadow-[0_8px_30px_rgba(40,65,77,0.10)]
        backdrop-blur-xl
      "
    >
      {/* 顶部微弱暖色环境光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-[18%] top-[-70px]
          h-32 w-60 rounded-full
          bg-[#EAC459]/7
          blur-3xl
        "
      />

      {/* 右侧水青环境光 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute right-[12%] top-[-80px]
          h-36 w-64 rounded-full
          bg-[#81B3A9]/8
          blur-3xl
        "
      />

      <div
        className="
          relative z-10
          mx-auto flex h-16
          max-w-[1440px]
          items-center justify-between
          px-4
          sm:px-6
          lg:px-10
        "
      >
        {/* Logo */}
        <Link
          className="
            group
            flex items-center gap-3
            rounded-md
            outline-none
            focus-visible:ring-2
            focus-visible:ring-[#EAC459]/75
          "
          to="/"
        >
          <span
            className="
              grid size-9 place-items-center
              rounded-full
              border border-[#C1DDDB]/35
              bg-[#81B3A9]/10
              text-[#C1DDDB]
              transition-all duration-300

              group-hover:border-[#EAC459]/50
              group-hover:bg-[#EAC459]/10
              group-hover:text-[#EAC459]
            "
          >
            <Waves
              aria-hidden="true"
              className="size-5"
            />
          </span>

          <span className="leading-none">
            <span
              className="
                block
                font-display
                text-sm font-semibold
                tracking-wide
                text-[#F2F5F3]
                sm:text-base
              "
            >
              {BRAND_NAME[language]}
            </span>

            <span
              className="
                mt-1 block
                text-[10px] font-semibold
                tracking-[0.12em]
                text-[#B3C6BB]
              "
            >
              {language === "zh" ? BRAND_NAME_EN_UPPER : BRAND_NAME.zh}
            </span>
          </span>
        </Link>

        {/* 桌面端导航 */}
        <nav
          aria-label={
            language === "zh"
              ? "主要导航"
              : "Primary navigation"
          }
          className="hidden items-center gap-1 xl:flex"
        >
          {navItems.map((item) => (
            <Link
              className="
                relative
                rounded-md
                px-3 py-3
                text-sm font-medium
                text-[#D7E2DE]
                outline-none
                transition-all duration-200

                after:absolute
                after:inset-x-3
                after:bottom-1.5
                after:h-px
                after:origin-center
                after:scale-x-0
                after:bg-[#EAC459]
                after:transition-transform
                after:duration-200

                hover:bg-[#81B3A9]/10
                hover:text-[#F6F7F2]
                hover:after:scale-x-100

                focus-visible:ring-2
                focus-visible:ring-[#EAC459]/70
              "
              key={item.to}
              to={item.to}
            >
              {item[language]}
            </Link>
          ))}
        </nav>

        {/* 桌面端语言切换 */}
        <div className="hidden lg:block">
          <LanguageToggle compact />
        </div>

        {/* 移动端菜单 */}
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label={
                  language === "zh"
                    ? "打开导航菜单"
                    : "Open navigation menu"
                }
                className="
                  border border-[#C1DDDB]/20
                  bg-[#81B3A9]/8
                  text-[#EAF1F9]

                  hover:bg-[#81B3A9]/16
                  hover:text-[#EAC459]
                "
                size="icon"
                variant="ghost"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent
              className="
                border-l border-[#C1DDDB]/18
                bg-[linear-gradient(180deg,#466772_0%,#3D5C68_100%)]
                text-[#EAF1F9]
              "
              closeLabel={
                language === "zh"
                  ? "关闭导航菜单"
                  : "Close navigation menu"
              }
            >
              {/* 移动端标题 */}
              <SheetTitle
                className="
                  font-display
                  text-xl
                  text-[#F2F5F3]
                "
              >
                {BRAND_NAME[language]}
              </SheetTitle>

              {/* 移动端导航 */}
              <nav
                aria-label={
                  language === "zh"
                    ? "移动端导航"
                    : "Mobile navigation"
                }
                className="
                  mt-12 flex flex-col
                  border-t border-[#C1DDDB]/20
                "
              >
                {navItems.map((item) => (
                  <SheetClose
                    asChild
                    key={item.to}
                  >
                    <Link
                      className="
                        group
                        flex items-center justify-between
                        border-b border-[#C1DDDB]/14
                        py-4
                        text-base font-medium
                        text-[#D7E2DE]
                        outline-none
                        transition-all duration-200

                        hover:pl-1
                        hover:text-[#EAC459]

                        focus-visible:bg-[#81B3A9]/12
                        focus-visible:text-[#EAC459]
                      "
                      to={item.to}
                    >
                      <span>{item[language]}</span>

                      <span
                        aria-hidden="true"
                        className="
                          h-px w-5
                          bg-[#81B3A9]/50
                          transition-all duration-200

                          group-hover:w-8
                          group-hover:bg-[#EAC459]/80
                        "
                      />
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              {/* 移动端语言切换 */}
              <div
                className="
                  mt-8
                  border-t border-[#C1DDDB]/14
                  pt-6
                "
              >
                <LanguageToggle />
              </div>

              {/* 底部装饰 */}
              <div
                aria-hidden="true"
                className="
                  mt-10
                  flex items-center gap-3
                "
              >
                <span className="h-px w-8 bg-[#EAC459]/65" />
                <span className="size-1.5 rounded-full bg-[#EAC459]/80" />
                <span className="h-px w-12 bg-[#81B3A9]/45" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
