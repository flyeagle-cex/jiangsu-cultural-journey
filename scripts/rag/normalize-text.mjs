const EMPTY_OR_DECORATIVE = /^[\s，,。；;：:·•\-—_]+$/u;
const IMAGE_PLACEHOLDER = /^(?:图|图片)\s*\d+\s*$/u;
const SHORT_NUMBERED_CAPTION = /^图\s*\d+\s*.{0,30}$/u;
const IMAGE_SOURCE_ONLY = /^图片来源\s*[:：]?\s*(?:网络|作者|摄制|拍摄)?\s*$/u;
const GENERIC_TABLE_LABEL = /^(?:板块|重点内容|名称|主要特点|地标|简介|年代|价值与现状|时期|事件|功能|历史表现|类别|项目|序号)$/u;

export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[\u200b-\u200d\ufeff]/gu, "")
    .replace(/\u00a0/gu, " ")
    .replace(/[\t ]+/gu, " ")
    .replace(/\s*\n\s*/gu, "\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();
}

export function isMeaningfulParagraph(value) {
  const text = normalizeText(value);
  if (!text || EMPTY_OR_DECORATIVE.test(text)) return false;
  if (
    IMAGE_PLACEHOLDER.test(text) ||
    SHORT_NUMBERED_CAPTION.test(text) ||
    IMAGE_SOURCE_ONLY.test(text) ||
    GENERIC_TABLE_LABEL.test(text)
  ) {
    return false;
  }
  return true;
}

export function dedupeParagraphs(paragraphs) {
  const seen = new Set();
  let duplicateCount = 0;

  const values = paragraphs.filter((paragraph) => {
    if (paragraph.kind === "heading") return true;
    const key = normalizeText(paragraph.text);
    if (seen.has(key)) {
      duplicateCount += 1;
      return false;
    }
    seen.add(key);
    return true;
  });

  return { paragraphs: values, duplicateCount };
}
