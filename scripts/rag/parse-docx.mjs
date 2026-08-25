import mammoth from "mammoth";
import { JSDOM } from "jsdom";

import { dedupeParagraphs, isMeaningfulParagraph, normalizeText } from "./normalize-text.mjs";
import { detectKnowledgeSection, inferHeading, inferInlineTitle } from "./section-detection.mjs";

const SPECIAL_SECTION_OVERRIDES = new Set(["route", "story", "reference"]);

function getHtmlLevel(element) {
  const match = element.tagName.match(/^H([1-6])$/u);
  return match ? Number(match[1]) : null;
}

function isEntirelyStrong(element, text) {
  const strongText = [...element.querySelectorAll("strong, b")]
    .map((node) => normalizeText(node.textContent))
    .join("")
    .replace(/\s+/gu, "");
  return Boolean(strongText) && strongText === text.replace(/\s+/gu, "");
}

function extractParagraphs(html) {
  const document = new JSDOM(html).window.document;
  const elements = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li")];
  const paragraphs = [];

  for (const [sourceOrder, element] of elements.entries()) {
    if (element.tagName === "P" && element.closest("li")) continue;
    const text = normalizeText(element.textContent);
    if (!isMeaningfulParagraph(text)) continue;
    if (element.querySelector("img") && text.length < 40) continue;

    const heading = inferHeading(text, {
      htmlLevel: getHtmlLevel(element),
      isStrong: isEntirelyStrong(element, text),
    });

    paragraphs.push(
      heading
        ? { kind: "heading", sourceOrder, text, ...heading }
        : { kind: "content", sourceOrder, text },
    );
  }

  return paragraphs;
}

function paragraphsToEntries(paragraphs, documentInfo) {
  let section = "overview";
  let title = `${documentInfo.nameZh}文化资料`;
  let parentTitle = title;
  const entries = [];

  for (const paragraph of paragraphs) {
    if (paragraph.kind === "heading") {
      const detectedSection = detectKnowledgeSection(paragraph.title);
      if (
        detectedSection &&
        (paragraph.isMain || section === "other" || SPECIAL_SECTION_OVERRIDES.has(detectedSection))
      ) {
        section = detectedSection;
      }
      title = paragraph.title;
      if (paragraph.isMain) parentTitle = paragraph.title;
      continue;
    }

    entries.push({
      city: documentInfo.slug,
      cityNameZh: documentInfo.nameZh,
      section,
      title: (paragraph.text.length >= 120 ? inferInlineTitle(paragraph.text) : null) ?? title,
      parentTitle,
      content: paragraph.text,
      sourceDocument: documentInfo.fileName,
      sourceOrder: paragraph.sourceOrder,
    });
  }

  return entries;
}

export async function parseDocxDocument(documentInfo) {
  const { value, messages } = await mammoth.convertToHtml(
    { path: documentInfo.filePath },
    {
      convertImage: mammoth.images.imgElement(() => Promise.resolve({ src: "" })),
      styleMap: [
        "p[style-name='标题 1'] => h1:fresh",
        "p[style-name='标题 2'] => h2:fresh",
        "p[style-name='标题 3'] => h3:fresh",
        "p[style-name='一级标题'] => h1:fresh",
        "p[style-name='二级标题'] => h2:fresh",
        "p[style-name='三级标题'] => h3:fresh",
      ],
    },
  );

  const extracted = extractParagraphs(value);
  const { paragraphs, duplicateCount } = dedupeParagraphs(extracted);
  return {
    entries: paragraphsToEntries(paragraphs, documentInfo),
    duplicateCount,
    warnings: messages.map((message) => message.message),
  };
}
