import { DEFAULT_CHUNK_OPTIONS } from "./config.mjs";
import { normalizeText } from "./normalize-text.mjs";

function splitSentences(text) {
  const matches = normalizeText(text).match(/[^。！？!?；;\n]+[。！？!?；;]?|\n+/gu);
  return (matches ?? [text]).map((sentence) => sentence.trim()).filter(Boolean);
}

function overlapFrom(sentences, limit) {
  const overlap = [];
  let size = 0;
  for (let index = sentences.length - 1; index >= 0; index -= 1) {
    const sentence = sentences[index];
    if (size && size + sentence.length > limit) break;
    if (!size && sentence.length > limit * 1.8) break;
    overlap.unshift(sentence);
    size += sentence.length;
  }
  return overlap;
}

function splitLongContent(content, options) {
  if (content.length <= options.maxCharacters) return [content];

  const sentences = splitSentences(content);
  const chunks = [];
  let current = [];

  const flush = () => {
    if (!current.length) return;
    chunks.push(current.join(""));
    current = overlapFrom(current, options.overlapCharacters);
  };

  for (const sentence of sentences) {
    const currentLength = current.join("").length;
    const nextLength = currentLength + sentence.length;
    const targetDistance = Math.abs(options.targetCharacters - currentLength);
    const nextTargetDistance = Math.abs(options.targetCharacters - nextLength);
    const reachedSoftTarget =
      currentLength >= options.targetCharacters * 0.6 && nextTargetDistance > targetDistance;

    if (current.length && (nextLength > options.maxCharacters || reachedSoftTarget)) flush();
    current.push(sentence);
  }
  if (current.length) chunks.push(current.join(""));

  return chunks.filter((chunk, index) => index === 0 || chunk !== chunks[index - 1]);
}

function sameGroup(left, right) {
  return (
    left.city === right.city &&
    left.section === right.section &&
    left.title === right.title &&
    left.parentTitle === right.parentTitle &&
    left.sourceDocument === right.sourceDocument
  );
}

function groupEntries(entries) {
  const groups = [];
  let current = null;

  for (const entry of entries) {
    if (!current || !sameGroup(current.meta, entry)) {
      current = { meta: entry, contents: [], sourceOrder: entry.sourceOrder };
      groups.push(current);
    }

    current.contents.push(entry.content);
  }

  return groups;
}

function canMergeSmallChunks(left, right, options) {
  if (
    left.city !== right.city ||
    left.section !== right.section ||
    left.sourceDocument !== right.sourceDocument
  ) {
    return false;
  }
  if (left.parentTitle !== right.parentTitle) return false;

  const combinedLength = left.content.length + right.content.length + 2;
  if (combinedLength > options.maxCharacters) return false;
  if (left.content.length < 40 || right.content.length < 40) return true;

  const completeEntryCharacters = Math.max(120, Math.round(options.targetCharacters * 0.25));
  if (
    left.title !== right.title &&
    left.content.length >= completeEntryCharacters &&
    right.content.length >= completeEntryCharacters
  ) {
    return false;
  }

  const currentDistance = Math.min(
    Math.abs(options.targetCharacters - left.content.length),
    Math.abs(options.targetCharacters - right.content.length),
  );
  const mergedDistance = Math.abs(options.targetCharacters - combinedLength);
  return combinedLength <= options.targetCharacters || mergedDistance < currentDistance;
}

function mergeSmallChunks(chunks, options) {
  const merged = [];
  for (const chunk of chunks) {
    const previous = merged.at(-1);
    if (previous && canMergeSmallChunks(previous, chunk, options)) {
      previous.content = `${previous.content}\n\n${chunk.content}`;
      previous.title =
        previous.parentTitle && previous.parentTitle === chunk.parentTitle
          ? previous.parentTitle
          : previous.title;
      continue;
    }
    merged.push({ ...chunk });
  }
  return merged;
}

export function chunkEntries(entries, customOptions = {}) {
  const options = { ...DEFAULT_CHUNK_OPTIONS, ...customOptions };
  const rawChunks = [];

  for (const group of groupEntries(entries)) {
    const content = group.contents.join("\n\n");
    for (const part of splitLongContent(content, options)) {
      rawChunks.push({
        city: group.meta.city,
        cityNameZh: group.meta.cityNameZh,
        section: group.meta.section,
        title: group.meta.title,
        ...(group.meta.parentTitle ? { parentTitle: group.meta.parentTitle } : {}),
        content: part,
        sourceDocument: group.meta.sourceDocument,
        sourceOrder: group.sourceOrder,
      });
    }
  }

  const sectionCounters = new Map();
  return mergeSmallChunks(rawChunks, options).map((chunk, index) => {
    const key = `${chunk.city}:${chunk.section}`;
    const sectionIndex = (sectionCounters.get(key) ?? 0) + 1;
    sectionCounters.set(key, sectionIndex);
    return {
      id: `${chunk.city}-${chunk.section}-${String(sectionIndex).padStart(3, "0")}`,
      ...chunk,
      chunkIndex: index + 1,
    };
  });
}
