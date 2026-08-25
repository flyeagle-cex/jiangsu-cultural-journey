import mammoth from "mammoth";
import { JSDOM } from "jsdom";

import { dedupeParagraphs, isMeaningfulParagraph, normalizeText } from "./normalize-text.mjs";
import {
  detectKnowledgeSection,
  inferHeading,
  inferInlineTitle,
  isStandaloneSpecialHeading,
} from "./section-detection.mjs";

const REFERENCE_LABEL = "(?:资料来源|参考资料|参考文献|信息来源|来源说明)";
const REFERENCE_AT_START = new RegExp(`^${REFERENCE_LABEL}\\s*[:：]?`, "u");
const REFERENCE_WITH_COLON = new RegExp(`${REFERENCE_LABEL}\\s*[:：]`, "u");

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

export function splitInlineReference(text) {
  const normalized = normalizeText(text);
  const startMatch = normalized.match(REFERENCE_AT_START);
  const inlineMatch = normalized.match(REFERENCE_WITH_COLON);
  const match = startMatch ?? inlineMatch;
  if (!match || match.index === undefined) return [{ kind: "content", text: normalized }];

  const values = [];
  const content = normalized.slice(0, match.index).trim();
  const reference = normalized.slice(match.index).trim();
  if (content) values.push({ kind: "content", text: content });
  if (reference) {
    values.push({
      kind: "reference",
      text: reference,
      title: match[0].replace(/[\s：:]+$/gu, ""),
    });
  }
  return values;
}

export function extractParagraphsFromHtml(html) {
  const document = new JSDOM(html).window.document;
  const elements = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li")];
  const paragraphs = [];
  let tableDerivedParagraphs = 0;
  let tableHeadingCandidatesIgnored = 0;

  for (const [sourceOrder, element] of elements.entries()) {
    if (element.tagName === "P" && element.closest("li")) continue;
    const text = normalizeText(element.textContent);
    if (!isMeaningfulParagraph(text)) continue;
    if (element.querySelector("img") && text.length < 40) continue;

    const htmlLevel = getHtmlLevel(element);
    const isStrong = isEntirelyStrong(element, text);
    const isInTable = Boolean(element.closest("table"));
    const heading = inferHeading(text, { htmlLevel, isStrong, isInTable });

    if (isInTable) {
      tableDerivedParagraphs += 1;
      if (!heading && inferHeading(text, { htmlLevel, isStrong, isInTable: false })) {
        tableHeadingCandidatesIgnored += 1;
      }
    }

    paragraphs.push(
      heading
        ? { kind: "heading", sourceOrder, text, ...heading }
        : { kind: "content", sourceOrder, text },
    );
  }

  return { paragraphs, tableDerivedParagraphs, tableHeadingCandidatesIgnored };
}

export function paragraphsToEntries(paragraphs, documentInfo) {
  let section = "overview";
  let title = `${documentInfo.nameZh}文化资料`;
  let parentTitle = title;
  const entries = [];

  for (const paragraph of paragraphs) {
    if (paragraph.kind === "heading") {
      const detectedSection = detectKnowledgeSection(paragraph.title);
      if (
        detectedSection &&
        (paragraph.isMain || section === "other" || isStandaloneSpecialHeading(paragraph.title))
      ) {
        section = detectedSection;
      }
      title = paragraph.title;
      if (paragraph.isMain) parentTitle = paragraph.title;
      continue;
    }

    for (const part of splitInlineReference(paragraph.text)) {
      entries.push({
        city: documentInfo.slug,
        cityNameZh: documentInfo.nameZh,
        section: part.kind === "reference" ? "reference" : section,
        title:
          part.kind === "reference"
            ? part.title
            : (part.text.length >= 120 ? inferInlineTitle(part.text) : null) ?? title,
        parentTitle,
        content: part.text,
        sourceDocument: documentInfo.fileName,
        sourceOrder: paragraph.sourceOrder,
      });
    }
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

  const extracted = extractParagraphsFromHtml(value);
  const { paragraphs, duplicateCount } = dedupeParagraphs(extracted.paragraphs);
  return {
    entries: paragraphsToEntries(paragraphs, documentInfo),
    duplicateCount,
    tableDerivedParagraphs: extracted.tableDerivedParagraphs,
    tableHeadingCandidatesIgnored: extracted.tableHeadingCandidatesIgnored,
    warnings: messages.map((message) => message.message),
  };
}
