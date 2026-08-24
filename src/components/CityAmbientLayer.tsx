import type { CSSProperties } from "react";

import { CITY_AMBIENT_CONFIGS } from "@/data/city-ambient";
import type { CitySkylineKind } from "@/data/city-ambient";
import type { CitySlug } from "@/types/city";

type CityAmbientLayerProps = {
  citySlug?: CitySlug;
};

const CITY_FLOWER_SLOTS = [
  { left: "14%", bottom: "34px", size: 48, duration: "27s", delay: "-7s" },
  { left: "51%", bottom: "52px", size: 58, duration: "34s", delay: "-19s" },
  { left: "82%", bottom: "29px", size: 42, duration: "30s", delay: "-12s" },
];

const GENERIC_FLOWER_SLOTS = CITY_FLOWER_SLOTS.slice(0, 2);

const SKYLINE_PATHS: Record<CitySkylineKind, string[]> = {
  "ming-wall": [
    "M-20 181h210v-44h22v-12h28v12h134v-12h28v12h22v44h176v-63h44v63h128v-36h42v36h210v-49h20v-12h25v12h101v-12h25v12h20v49h224",
    "M190 151h234M238 181v-24h48v24M337 181v-24h48v24M586 181v-39h144v39M1120 153h191M1158 181v-27h42v27M1240 181v-27h40v27",
    "M785 173h146l-22 24h-98l-26-24Zm32 0v-22h74v22m-62-22c10-15 40-15 50 0",
  ],
  "garden-gate": [
    "M-20 181h278m-238-1v-43h196v43M0 137h238c-53-12-88-28-118-55-31 27-66 43-120 55M290 181h245M333 181V75c34-17 126-17 160 0v106M373 181V96c22-8 58-8 80 0v85M373 144c16-20 64-20 80 0",
    "M500 181h460m35 0h350m-345-4c70-75 215-75 285 0M1020 177v-25m62 25v-55m90 55v-55m62 55v-25",
    "M1320 181h300m-265 0v-48h222v48m-241-48h260c-56-11-96-28-130-55-35 27-74 44-130 55",
  ],
  "taihu-bridge": [
    "M-30 167c102-45 187-42 282 6 109-82 228-83 352-4 103-40 199-38 303 5 112-73 226-73 345-3 111-48 214-42 348-5",
    "M70 181h850M92 177c153-96 540-96 696 0M155 177v-44m119 44V93m210 84v-60m205 60V93m102 84v-44",
    "M1250 52v12m-17 8h34m-45 13h56l-9 9h-38l-9-9m10 9v22h36V94m-54 25h72l-11 11h-50l-11-11m11 11v27h50v-27m-70 31h90l-14 16h-62l-14-16m14 16v10m-34 0h112",
  ],
  "tianning-pagoda": [
    "M-20 181h150v-34h42v34h88v-49h39v49h97v-29h55v29h159m320 0h122v-35h45v35h98v-56h38v56h111v-31h55v31h201",
    "M190 22v14m-22 8h44m-58 14h72l-11 11h-50l-11-11m13 11v20h46V69m-68 24h90l-14 13h-62l-14-13m14 13v23h62v-23m-84 28h106l-16 15h-74l-16-15m16 15v28h74v-28m-110 32h126",
    "M130 181v-36h190v36m-214-36h238c-54-12-86-28-119-52-32 24-66 40-119 52M1220 181v-42h206v42m-228-42h249c-57-12-91-29-125-53-34 24-68 41-124 53",
  ],
  "jinshan-temple": [
    "M-30 170c120-40 218-39 325 7 132-104 310-105 468-7 120-48 243-41 364 5 118-68 255-65 473-8",
    "M410 181h460M445 181v-53h112v53m-132-53h151c-38-11-61-25-76-44-19 20-40 34-75 44M594 181v-79h146v79m-170-79h195c-44-12-74-31-98-59-23 28-55 48-97 59M780 181v-44h66v44",
    "M182 79v10m-15 8h30m-39 12h48l-8 8h-32l-8-8m8 8v18h32v-18m-47 22h62l-10 10h-42l-10-10m10 10v25h42v-25m-58 29h74",
  ],
  "five-pavilion-bridge": [
    "M-20 181h1640M110 176c100-84 208-84 308 0 101-84 237-84 338 0 102-84 237-84 339 0 100-76 208-76 305 0",
    "M186 176v-52m-45 0h90m-56 0h22m-66 0c23-11 39-26 55-51 16 25 32 40 55 51M484 176v-66m-48 0h96m-59 0h22m-69 0c26-13 42-29 58-55 16 26 33 42 58 55M755 176v-73m-50 0h100m-62 0h24m-72 0c27-14 44-31 60-58 17 27 34 44 60 58M1054 176v-66m-48 0h96m-59 0h22m-69 0c26-13 42-29 58-55 16 26 33 42 58 55M1330 176v-52m-45 0h90m-56 0h22m-66 0c23-11 39-26 55-51 16 25 32 40 55 51",
    "M590 201c104-12 196 11 293 0 98-11 195-11 300 1",
  ],
  "opera-pavilion": [
    "M-20 181h1640M120 181v-69h250v69m-275-69h300c-68-5-120-29-150-67-31 38-82 62-150 67M172 181v-40h146v40",
    "M540 181v-93h520v93M500 88c118 0 205-30 300-88 94 58 182 88 300 88-76 22-177 27-300 5-124 22-224 17-300-5M650 181v-57h300v57",
    "M1190 181v-57h232v57m-257-57h282c-65-8-112-27-141-58-30 31-77 50-141 58",
  ],
  "river-port": [
    "M-20 181h145v-35h42v35h80v-57h40v57h88v-34h61v34h172m460 0h85v-39h46v39h88v-61h41v61h93v-33h59v33h160",
    "M130 181V68h20v113m0-109h173L150 125m137-52v70m-12 0h24M1190 181V91h17v90m0-86h139l-139 43m107-42v58m-10 0h20",
    "M570 157h390l-58 42H632l-62-42m77 0v-37h193v37m-130-37v-28h103",
    "M1450 39l43 39-43 35-43-35 43-39m0 0v74m-43-35h86m-43 35c18 14 22 26 11 39 17-8 32-4 42 8",
  ],
  "wetland-tower": [
    "M-20 181h1640M80 181c18-52 22-94 14-134m-3 16c-24-17-38-8-44 6 16 10 30 11 46 2m44 110c9-57 9-103 0-147m-2 26c25-19 41-11 48 2-16 12-32 14-48 5M1220 181c4-51 15-97 33-138m-5 21c24-22 40-15 48-2-16 14-31 17-49 10m77 109c-2-53 5-99 22-142",
    "M112 181 167 62h146l56 119M142 130h198M161 91h160M167 62 240 14l73 48M195 181v-51m90 51v-51",
    "M1350 81c38-43 94-43 128-3-40-11-67-3-79 24 27 4 46 20 55 46m-55-46c-14 34-13 71 4 108m32-63-3 63m34-132c28-15 49-12 67 7",
  ],
  "canal-gate": [
    "M-20 181h1640M60 181V88h520v93M20 88h600c-109-19-189-42-300-78-112 36-191 59-300 78M170 181v-57h300v57M225 181v-37h190v37",
    "M42 181v-44h235v44M20 137h280c-61-13-103-31-140-59-37 28-79 46-140 59M1090 172h168l-25 26h-113l-30-26m37 0v-27h88v27m-73-27c10-15 48-15 59 0",
    "M1330 181v-58h218v58m-240-58h262c-49-11-87-27-131-58-43 31-82 47-131 58m66 58v-35h130v35",
  ],
  "lake-bridge": [
    "M-30 168c112-47 216-43 323 7 126-83 267-87 406-5 128-43 250-36 371 6 130-71 279-72 530-9",
    "M55 181h850M90 177c166-103 535-103 700 0M160 177v-47m125 47V88m205 89v-64m205 64V88m90 89v-47",
    "M1110 181h320m-285 0V93h70v88m110 0V93h70v88m-270-88h110l-55-28-55 28m180 0h110l-55-28-55 28m-55 39h70m110 0h70",
  ],
  "han-gate": [
    "M-30 168c112-49 219-42 326 7 129-91 270-92 416-5 122-45 237-37 351 5 130-75 275-73 537-9",
    "M140 181h330m-290 0V72h78v109m96 0V72h78v109M158 72h122l-61-36-61 36m174 0h122l-61-36-61 36m-135 45h54m126 0h54",
    "M1030 181h330m-290 0V83h78v98m96 0V83h78v98m-274-98h122l-61-36-61 36m174 0h122l-61-36-61 36m-135 43h54m126 0h54",
    "M590 181V125h300v56M555 125h370c-74-13-126-31-185-68-58 37-111 55-185 68m119 56v-34h132v34",
  ],
  "mountain-harbor": [
    "M-30 168c115-54 214-46 317 8 127-116 304-125 468-6 115-55 241-47 358 4 130-87 281-86 487-8",
    "M242 91v9m-13 7h26m-34 11h42l-7 7h-28l-7-7m7 7v16h28v-16m-41 20h55l-9 9h-37l-9-9m9 9v23h37v-23m-51 27h65",
    "M1030 181V99h18v82m0-78h151l-151 46m117-45v61m-11 0h22M570 162h350l-53 38H626l-56-38m70 0v-31h171v31m-112-31v-26h91",
  ],
};

export function CityAmbientLayer({ citySlug }: CityAmbientLayerProps) {
  const config = citySlug ? CITY_AMBIENT_CONFIGS[citySlug] : undefined;
  const flowers = citySlug ? CITY_FLOWER_SLOTS : GENERIC_FLOWER_SLOTS;

  return (
    <div
      aria-hidden="true"
      className="city-ambient-layer"
      data-city-ambient={citySlug ?? "generic"}
      data-city-landmark={config?.landmark}
      style={{ "--ambient-line": config?.lineColor ?? "#C1DDDB" } as CSSProperties}
    >
      {config ? (
        <div className="city-ambient-skyline" data-skyline={config.skyline}>
          <CitySkyline kind={config.skyline} />
        </div>
      ) : null}

      <div className="city-ambient-bottom">
        <BottomWave className="city-ambient-wave city-ambient-wave--back" offset={0} />
        <BottomWave className="city-ambient-wave city-ambient-wave--front" offset={20} />
        <div className="city-ambient-flowers">
          {flowers.map((flower, index) => (
            <span
              className="city-ambient-flower"
              data-flower-index={index + 1}
              key={`${flower.left}-${flower.size}`}
              style={
                {
                  left: flower.left,
                  bottom: flower.bottom,
                  width: `${flower.size}px`,
                  height: `${flower.size}px`,
                  animationDuration: flower.duration,
                  animationDelay: flower.delay,
                } as CSSProperties
              }
            >
              <JasmineFlower />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BottomWave({ className, offset }: { className: string; offset: number }) {
  const y = 78 + offset;
  const crest = y - 42;
  const trough = y + 42;
  const path = `M0 ${y} C190 ${crest} 330 ${trough} 520 ${y} S850 ${crest} 1040 ${y} S1410 ${trough} 1600 ${y}`;

  return (
    <svg className={className} preserveAspectRatio="none" viewBox="0 0 3200 180" xmlns="http://www.w3.org/2000/svg">
      <path d={path} />
      <path d={path} transform="translate(1600 0)" />
    </svg>
  );
}

function JasmineFlower() {
  return (
    <svg fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <g fill="#F4F1E8" stroke="rgba(214, 205, 190, 0.78)" strokeWidth="1.15">
        {[0, 72, 144, 216, 288].map((rotation) => (
          <ellipse cx="32" cy="17" key={rotation} rx="9" ry="15" transform={`rotate(${rotation} 32 32)`} />
        ))}
      </g>
      <circle cx="32" cy="32" fill="#EAC459" opacity="0.9" r="4.2" />
      <circle cx="32" cy="32" r="2.2" stroke="#D6CDBE" strokeWidth="1" />
    </svg>
  );
}

function CitySkyline({ kind }: { kind: CitySkylineKind }) {
  return (
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 1600 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55">
        <path d="M-60 198c184-13 311 17 486 2 178-15 301-14 470 1 171 15 314-16 470-2 105 9 189 9 294-1" opacity="0.68" />
        <path d="M-60 208c174-11 300 15 475 3 182-13 318-12 482 1 165 13 304-15 465-3 105 8 194 9 298 0" opacity="0.34" />
        {SKYLINE_PATHS[kind].map((path, index) => (
          <path d={path} key={`${kind}-${index}`} opacity={index === 0 ? 0.74 : 0.92} />
        ))}
      </g>
    </svg>
  );
}
