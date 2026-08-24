import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import type { CitySectionId, CitySlug } from "@/types/city";

type MotifKind =
  | "jasmine"
  | "bridge"
  | "wall"
  | "brocade"
  | "garden"
  | "teapot"
  | "comb"
  | "bamboo"
  | "pagoda"
  | "jar"
  | "fan"
  | "opera"
  | "boat"
  | "teacup"
  | "kite"
  | "indigo"
  | "crane"
  | "reed"
  | "salt"
  | "drum"
  | "gate"
  | "crab"
  | "hanstone"
  | "cloud"
  | "peach"
  | "crystal";

type CityAmbientConfig = {
  accent: string;
  secondary: string;
  cityMotifs: [MotifKind, MotifKind, MotifKind];
};

const CITY_AMBIENT: Record<CitySlug, CityAmbientConfig> = {
  nanjing: {
    accent: "#EAC459",
    secondary: "#C1DDDB",
    cityMotifs: ["wall", "brocade", "boat"],
  },
  suzhou: {
    accent: "#B3C6BB",
    secondary: "#D6CDBE",
    cityMotifs: ["garden", "brocade", "boat"],
  },
  wuxi: {
    accent: "#81B3A9",
    secondary: "#D6CDBE",
    cityMotifs: ["teapot", "boat", "bridge"],
  },
  changzhou: {
    accent: "#B3C6BB",
    secondary: "#EAC459",
    cityMotifs: ["comb", "bamboo", "brocade"],
  },
  zhenjiang: {
    accent: "#EAC459",
    secondary: "#D6CDBE",
    cityMotifs: ["pagoda", "jar", "bridge"],
  },
  yangzhou: {
    accent: "#D6CDBE",
    secondary: "#EAC459",
    cityMotifs: ["fan", "garden", "boat"],
  },
  taizhou: {
    accent: "#F09C77",
    secondary: "#C1DDDB",
    cityMotifs: ["opera", "boat", "teacup"],
  },
  nantong: {
    accent: "#81B3A9",
    secondary: "#C1DDDB",
    cityMotifs: ["kite", "indigo", "boat"],
  },
  yancheng: {
    accent: "#C1DDDB",
    secondary: "#EAF1F9",
    cityMotifs: ["crane", "reed", "salt"],
  },
  huaian: {
    accent: "#81B3A9",
    secondary: "#EAC459",
    cityMotifs: ["boat", "gate", "drum"],
  },
  suqian: {
    accent: "#EAC459",
    secondary: "#F09C77",
    cityMotifs: ["jar", "boat", "crab"],
  },
  xuzhou: {
    accent: "#D6CDBE",
    secondary: "#EAC459",
    cityMotifs: ["hanstone", "cloud", "gate"],
  },
  lianyungang: {
    accent: "#C1DDDB",
    secondary: "#81B3A9",
    cityMotifs: ["peach", "crystal", "boat"],
  },
};

const GENERIC_CONFIG: CityAmbientConfig = {
  accent: "#C1DDDB",
  secondary: "#EAC459",
  cityMotifs: ["boat", "bridge", "cloud"],
};

const FLOAT_SLOTS = [
  { left: "5%", top: "11%", size: 48, delay: "-3s", duration: "28s", drift: "ambient-float-a" },
  { left: "83%", top: "17%", size: 70, delay: "-13s", duration: "34s", drift: "ambient-float-b" },
  { left: "16%", top: "43%", size: 38, delay: "-8s", duration: "25s", drift: "ambient-float-c" },
  { left: "88%", top: "60%", size: 58, delay: "-19s", duration: "37s", drift: "ambient-float-a" },
  { left: "67%", top: "35%", size: 44, delay: "-5s", duration: "31s", drift: "ambient-float-b" },
  { left: "27%", top: "74%", size: 64, delay: "-16s", duration: "39s", drift: "ambient-float-c" },
  { left: "48%", top: "13%", size: 34, delay: "-21s", duration: "33s", drift: "ambient-float-a" },
  { left: "57%", top: "83%", size: 46, delay: "-10s", duration: "36s", drift: "ambient-float-b" },
];

const CITY_SECTIONS: CitySectionId[] = ["overview", "nature", "history", "heritage", "food", "waterways"];

function resolveInitialSection(): CitySectionId {
  if (typeof window === "undefined") return "overview";
  const hashSection = window.location.hash.replace("#city-", "") as CitySectionId;
  return CITY_SECTIONS.includes(hashSection) ? hashSection : "overview";
}

export function CityAmbientLayer({ citySlug }: { citySlug?: CitySlug }) {
  const config = citySlug ? CITY_AMBIENT[citySlug] : GENERIC_CONFIG;
  const [activeSection, setActiveSection] = useState<CitySectionId>(resolveInitialSection);
  const [firstMotif, secondMotif, thirdMotif] = config.cityMotifs;
  const motifs: MotifKind[] = citySlug
    ? ["jasmine", firstMotif, "jasmine", secondMotif, "jasmine", thirdMotif, "jasmine", firstMotif]
    : ["jasmine", "boat", "jasmine"];

  useEffect(() => {
    if (!citySlug) return;
    setActiveSection(resolveInitialSection());
    const sections = CITY_SECTIONS.map((id) => document.getElementById(`city-${id}`)).filter(
      (section): section is HTMLElement => Boolean(section),
    );
    const visibleRatios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibleRatios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
        const active = [...visibleRatios.entries()].sort((a, b) => b[1] - a[1])[0];
        if (!active || active[1] <= 0) return;
        const nextSection = active[0].id.replace("city-", "") as CitySectionId;
        if (CITY_SECTIONS.includes(nextSection)) setActiveSection(nextSection);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.12, 0.3, 0.55] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [citySlug]);

  const style = {
    "--ambient-accent": config.accent,
    "--ambient-secondary": config.secondary,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="city-ambient-layer"
      data-active-section={citySlug ? activeSection : "waterways"}
      data-city-ambient={citySlug ?? "generic"}
      style={style}
    >
      <div className="city-ambient-section-tints">
        {CITY_SECTIONS.map((section) => (
          <span data-section-tint={section} key={section} />
        ))}
      </div>
      <div className="city-ambient-water city-ambient-water--one" />
      <div className="city-ambient-water city-ambient-water--two" />
      <div className="city-ambient-water city-ambient-water--three" />
      <div className="city-ambient-shimmer" />

      <div className="city-ambient-motifs">
        {motifs.map((motif, index) => {
          const slot = FLOAT_SLOTS[index];
          return (
            <span
              className={`city-ambient-motif ${slot.drift}`}
              data-motif-kind={motif}
              key={`${motif}-${index}`}
              style={
                {
                  left: slot.left,
                  top: slot.top,
                  width: `${slot.size}px`,
                  height: `${slot.size}px`,
                  animationDelay: slot.delay,
                  animationDuration: slot.duration,
                } as CSSProperties
              }
            >
              <Motif kind={motif} />
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Motif({ kind }: { kind: MotifKind }) {
  switch (kind) {
    case "jasmine":
      return <JasmineMotif />;
    case "bridge":
      return <BridgeMotif />;
    case "wall":
      return <WallMotif />;
    case "brocade":
      return <BrocadeMotif />;
    case "garden":
      return <GardenMotif />;
    case "teapot":
      return <TeapotMotif />;
    case "comb":
      return <CombMotif />;
    case "bamboo":
      return <BambooMotif />;
    case "pagoda":
      return <PagodaMotif />;
    case "jar":
      return <JarMotif />;
    case "fan":
      return <FanMotif />;
    case "opera":
      return <OperaMotif />;
    case "boat":
      return <BoatMotif />;
    case "teacup":
      return <TeaCupMotif />;
    case "kite":
      return <KiteMotif />;
    case "indigo":
      return <IndigoMotif />;
    case "crane":
      return <CraneMotif />;
    case "reed":
      return <ReedMotif />;
    case "salt":
      return <SaltMotif />;
    case "drum":
      return <DrumMotif />;
    case "gate":
      return <GateMotif />;
    case "crab":
      return <CrabMotif />;
    case "hanstone":
      return <HanStoneMotif />;
    case "cloud":
      return <CloudMotif />;
    case "peach":
      return <PeachMotif />;
    case "crystal":
      return <CrystalMotif />;
    default:
      return <JasmineMotif />;
  }
}

function SvgShell({ children }: { children: ReactNode }) {
  return (
    <svg fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        {children}
      </g>
    </svg>
  );
}

function JasmineMotif() {
  return (
    <SvgShell>
      <path d="M32 31c-8-13-19-9-18-1 1 7 9 8 18 3" />
      <path d="M32 31c13-8 9-19 1-18-7 1-8 9-3 18" />
      <path d="M32 31c8 13 19 9 18 1-1-7-9-8-18-3" />
      <path d="M32 31c-13 8-9 19-1 18 7-1 8-9 3-18" />
      <circle cx="32" cy="31" r="3.5" />
      <path d="M35 39c4 5 5 9 3 14" />
    </SvgShell>
  );
}

function BridgeMotif() {
  return (
    <SvgShell>
      <path d="M7 45h50" />
      <path d="M10 41c10-18 34-18 44 0" />
      <path d="M15 42v-7M24 42v-13M32 42V26M40 42V29M49 42v-7" />
      <path d="M5 51c10-3 18-3 27 0 9 3 18 3 27 0" />
    </SvgShell>
  );
}

function WallMotif() {
  return (
    <SvgShell>
      <path d="M10 48V24h8v-7h8v7h12v-7h8v7h8v24" />
      <path d="M8 48h48" />
      <path d="M19 48V36h8v12M37 48V36h8v12" />
      <path d="M10 30h44" />
    </SvgShell>
  );
}

function BrocadeMotif() {
  return (
    <SvgShell>
      <path d="M32 10 42 22 54 32 42 42 32 54 22 42 10 32 22 22 32 10Z" />
      <circle cx="32" cy="32" r="11" />
      <path d="m32 21 4 7 7 4-7 4-4 7-4-7-7-4 7-4 4-7Z" />
    </SvgShell>
  );
}

function GardenMotif() {
  return (
    <SvgShell>
      <path d="M12 50h40" />
      <path d="M17 50V28l15-12 15 12v22" />
      <path d="M23 50V34h18v16" />
      <path d="M9 28h46" />
      <path d="M14 25c8-4 28-4 36 0" />
    </SvgShell>
  );
}

function TeapotMotif() {
  return (
    <SvgShell>
      <path d="M20 27h25v18c0 7-6 10-13 10s-12-3-12-10V27Z" />
      <path d="M24 27c2-8 15-8 17 0" />
      <path d="M45 31c9 0 12 5 10 10-1 4-5 6-10 6" />
      <path d="M20 34c-6-1-10 1-12 5 4 1 8 1 12-1" />
      <path d="M28 19h9" />
    </SvgShell>
  );
}

function CombMotif() {
  return (
    <SvgShell>
      <path d="M12 22c10-8 30-8 40 0v10H12V22Z" />
      <path d="M15 32v18M20 32v18M25 32v18M30 32v18M35 32v18M40 32v18M45 32v18M50 32v18" />
      <path d="M21 22c3-4 19-4 22 0" />
    </SvgShell>
  );
}

function BambooMotif() {
  return (
    <SvgShell>
      <path d="M28 9c-3 15-2 31 0 46M36 8c2 14 2 30-1 47" />
      <path d="M25 20h7M25 32h7M25 44h7M33 18h7M33 30h7M33 42h7" />
      <path d="M27 23c-10-5-14-1-17 3 7 2 13 1 17-3ZM36 27c10-5 14-1 17 3-7 2-13 1-17-3ZM27 40c-9-4-13-1-16 3 7 2 12 1 16-3Z" />
    </SvgShell>
  );
}

function PagodaMotif() {
  return (
    <SvgShell>
      <path d="M32 7v7" />
      <path d="m23 18 9-5 9 5" />
      <path d="M18 23h28l-4 5H22l-4-5Z" />
      <path d="M23 28v7h18v-7" />
      <path d="M17 35h30l-5 6H22l-5-6Z" />
      <path d="M23 41v9h18v-9" />
      <path d="M14 50h36" />
    </SvgShell>
  );
}

function JarMotif() {
  return (
    <SvgShell>
      <path d="M24 13h16M26 18h12" />
      <path d="M24 18c0 5-8 9-8 22 0 11 7 16 16 16s16-5 16-16c0-13-8-17-8-22" />
      <path d="M22 35c6 3 14 3 20 0M20 43c8 3 16 3 24 0" />
    </SvgShell>
  );
}

function FanMotif() {
  return (
    <SvgShell>
      <path d="M11 42c4-18 13-28 21-28 9 0 18 10 21 28-13 7-29 7-42 0Z" />
      <path d="M32 14v31M22 18l6 27M42 18l-6 27M15 28l13 18M49 28 36 46" />
      <path d="M29 48h6v8h-6z" />
    </SvgShell>
  );
}

function OperaMotif() {
  return (
    <SvgShell>
      <path d="M17 13c8-5 22-5 30 0l4 14c3 13-5 28-19 30-14-2-22-17-19-30l4-14Z" />
      <path d="M20 27c5-5 8-5 12 0M44 27c-5-5-8-5-12 0" />
      <path d="M25 37c3 2 11 2 14 0M32 17v25" />
      <path d="M20 17c5 1 8 3 12 7 4-4 7-6 12-7" />
    </SvgShell>
  );
}

function BoatMotif() {
  return (
    <SvgShell>
      <path d="M10 38h44l-7 11H18l-8-11Z" />
      <path d="M20 38V24h24v14" />
      <path d="M25 24c2-8 12-8 14 0" />
      <path d="M6 54c8-3 16-3 24 0 8 3 16 3 28 0" />
    </SvgShell>
  );
}

function TeaCupMotif() {
  return (
    <SvgShell>
      <path d="M17 27h30v14c0 8-7 13-15 13S17 49 17 41V27Z" />
      <path d="M47 31h4c6 0 8 8 2 11-2 1-4 1-6 1" />
      <path d="M23 20c0-4 3-5 3-8M32 20c0-5 3-6 3-10M41 20c0-4 3-5 3-8" />
    </SvgShell>
  );
}

function KiteMotif() {
  return (
    <SvgShell>
      <path d="m32 8 18 20-18 16-18-16L32 8Z" />
      <path d="M32 8v36M14 28h36" />
      <path d="M32 44c5 4 7 7 4 11 5-2 9-1 12 2" />
    </SvgShell>
  );
}

function IndigoMotif() {
  return (
    <SvgShell>
      <rect height="42" rx="5" width="42" x="11" y="11" />
      <path d="M18 18h28v28H18z" />
      <path d="m32 18 6 8 8 6-8 6-6 8-6-8-8-6 8-6 6-8Z" />
    </SvgShell>
  );
}

function CraneMotif() {
  return (
    <SvgShell>
      <path d="M45 16c-9 2-16 9-16 17 0 7 5 11 11 11 7 0 11-5 11-11-5 3-9 2-11-1" />
      <path d="M29 33c-8 2-13 7-17 14 6-2 11-2 16 0" />
      <path d="M39 44v13M45 43l4 14" />
      <path d="M45 16c5-3 8-2 11 1" />
    </SvgShell>
  );
}

function ReedMotif() {
  return (
    <SvgShell>
      <path d="M18 55c4-17 5-31 3-44M30 55c2-16 2-29 0-42M42 55c-1-15 0-28 4-40" />
      <path d="M19 17c-7-4-9-1-10 2 4 2 8 2 11 0M29 21c-7-4-9-1-10 2 4 2 8 2 11 0M46 20c6-5 9-3 10 0-4 3-7 4-11 2" />
      <path d="M18 9c4-4 7-4 10 0-3 4-7 5-10 0ZM42 13c4-5 8-5 11 0-3 4-8 5-11 0Z" />
    </SvgShell>
  );
}

function SaltMotif() {
  return (
    <SvgShell>
      <path d="m32 8 13 8 9 13-8 13-14 14-14-14-8-13 9-13 13-8Z" />
      <path d="m32 8 3 18 19 3M10 29l19-3 3-18M18 42l11-16 17 16M18 42l14 14 14-14" />
    </SvgShell>
  );
}

function DrumMotif() {
  return (
    <SvgShell>
      <path d="M17 18h30v28H17z" />
      <ellipse cx="32" cy="18" rx="15" ry="6" />
      <ellipse cx="32" cy="46" rx="15" ry="6" />
      <path d="m20 23 24 18M44 23 20 41" />
      <path d="M50 15 57 8M50 23l8-8" />
    </SvgShell>
  );
}

function GateMotif() {
  return (
    <SvgShell>
      <path d="M12 52h40" />
      <path d="M17 52V26h30v26" />
      <path d="M13 26h38l-5-8H18l-5 8Z" />
      <path d="M23 52V35h18v17" />
      <path d="M10 18h44" />
    </SvgShell>
  );
}

function CrabMotif() {
  return (
    <SvgShell>
      <ellipse cx="32" cy="35" rx="13" ry="10" />
      <path d="M20 31 11 26M18 36 9 36M20 41 12 47M44 31l9-5M46 36h9M44 41l8 6" />
      <path d="M21 27c-5-7-11-5-12 0 4 1 7 1 12 0ZM43 27c5-7 11-5 12 0-4 1-7 1-12 0Z" />
      <circle cx="27" cy="31" r="1.5" />
      <circle cx="37" cy="31" r="1.5" />
    </SvgShell>
  );
}

function HanStoneMotif() {
  return (
    <SvgShell>
      <rect height="44" rx="2" width="38" x="13" y="10" />
      <path d="M19 44c8-17 19-21 28-20-6 5-10 10-12 18" />
      <path d="M21 40c6 2 15 2 23-2M23 19h18M18 49h28" />
    </SvgShell>
  );
}

function CloudMotif() {
  return (
    <SvgShell>
      <path d="M12 39c2-8 9-11 16-8 2-8 15-11 20-2 8-2 13 4 12 10H12Z" />
      <path d="M18 46h23M25 52h21" />
    </SvgShell>
  );
}

function PeachMotif() {
  return (
    <SvgShell>
      <path d="M32 17c-9-10-22-2-20 13 2 15 13 26 20 26s18-11 20-26c2-15-11-23-20-13Z" />
      <path d="M32 17c2-7 6-10 12-11" />
      <path d="M39 9c4-3 9-2 12 1-4 4-9 5-12-1Z" />
      <path d="M32 17c-1 8-1 16 0 25" />
    </SvgShell>
  );
}

function CrystalMotif() {
  return (
    <SvgShell>
      <path d="m32 7 15 10 8 18-10 19H19L9 35l8-18 15-10Z" />
      <path d="m17 17 15 38 15-38M9 35h46M19 54l13-19 13 19" />
      <path d="m17 17 15 18 15-18" />
    </SvgShell>
  );
}
