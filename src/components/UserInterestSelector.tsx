import { X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { useSavedItems } from "@/context/UserSavedStateContext";
import { CITY_SECTION_LABELS } from "@/types/city";
import { JOURNEY_INTEREST_ORDER } from "@/types/user-preferences";

const COPY = {
  zh: {
    heading: "我的兴趣主题",
    description:
      "选择你更感兴趣的文化主题，后续探索建议将优先参考这些由你主动设置的偏好。",
    group: "选择文化兴趣主题",
    clear: "清除兴趣",
  },
  en: {
    heading: "My Interests",
    description:
      "Choose the cultural themes you care about most. Future exploration suggestions can use these preferences you set yourself.",
    group: "Choose cultural interests",
    clear: "Clear Interests",
  },
} as const;

export function UserInterestSelector() {
  const { language } = useLanguage();
  const {
    interests,
    toggleInterest,
    clearInterests,
    isInterestSelected,
  } = useSavedItems();
  const copy = COPY[language];

  return (
    <section
      aria-labelledby="user-interests-heading"
      className="border-b border-[#C1DDDB]/28 py-10 sm:py-12"
      data-user-interests="true"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2
            className="font-display text-2xl font-semibold sm:text-3xl"
            id="user-interests-heading"
          >
            {copy.heading}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#C1DDDB]">{copy.description}</p>
        </div>
        {interests.length > 0 && (
          <button
            className="inline-flex min-h-11 items-center gap-2 px-2 py-2 text-sm font-semibold text-[#C1DDDB] outline-none transition-colors duration-150 hover:text-[#EAF1F9] focus-visible:ring-2 focus-visible:ring-[#EAC459]"
            onClick={clearInterests}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
            {copy.clear}
          </button>
        )}
      </div>

      <div
        aria-label={copy.group}
        className="mt-6 flex flex-wrap gap-3"
        role="group"
      >
        {JOURNEY_INTEREST_ORDER.map((interest) => {
          const selected = isInterestSelected(interest);
          return (
            <button
              aria-pressed={selected}
              className={`min-h-11 rounded-md border px-4 py-2.5 text-sm font-semibold outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#EAC459] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5E6C82] ${
                selected
                  ? "border-[#EAC459] bg-[#42769D]/45 text-[#EAF1F9]"
                  : "border-[#C1DDDB]/35 bg-[#42769D]/18 text-[#D7E2DE] hover:border-[#C1DDDB]/65 hover:text-[#EAF1F9]"
              }`}
              data-interest={interest}
              key={interest}
              onClick={() => toggleInterest(interest)}
              type="button"
            >
              {CITY_SECTION_LABELS[interest][language]}
            </button>
          );
        })}
      </div>
    </section>
  );
}
