import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chunkEntries } from "./chunk-document.mjs";
import { CITY_DEFINITIONS, KNOWLEDGE_SECTIONS } from "./config.mjs";
import { parseDocxDocument } from "./parse-docx.mjs";
import { discoverSourceDocuments } from "./source-documents.mjs";
import { validateKnowledgeChunks } from "./validate-corpus.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "../..");
const defaultOutputDirectory = path.join(projectRoot, "public", "knowledge");
const defaultReportPath = path.join(projectRoot, "knowledge", "generated", "report.json");

function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--source" || argument === "--output") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`VALUE_REQUIRED: ${argument}`);
      options[argument.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`UNKNOWN_ARGUMENT: ${argument}`);
  }
  return options;
}

function countBy(values, keySelector, keys) {
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));
  for (const value of values) counts[keySelector(value)] += 1;
  return counts;
}

function createManifest(chunks, generatedAt) {
  const cityCounts = countBy(chunks, (chunk) => chunk.city, CITY_DEFINITIONS.map((city) => city.slug));
  const sectionCounts = countBy(chunks, (chunk) => chunk.section, KNOWLEDGE_SECTIONS);
  return {
    version: "1.0.0",
    generatedAt,
    totalChunks: chunks.length,
    cities: Object.fromEntries(
      CITY_DEFINITIONS.map((city) => [city.slug, { nameZh: city.nameZh, chunks: cityCounts[city.slug] }]),
    ),
    sectionCounts,
  };
}

function createReport(chunks, documents, parsedResults, generatedAt) {
  const characterCounts = chunks.map((chunk) => chunk.content.length);
  const totalCharacters = characterCounts.reduce((sum, count) => sum + count, 0);
  const referenceChunks = chunks.filter((chunk) => chunk.section === "reference");
  const referenceDocumentsDetected = new Set(
    referenceChunks.map((chunk) => chunk.sourceDocument),
  ).size;
  return {
    version: "1.0.0",
    generatedAt,
    sourceDocuments: {
      count: documents.length,
      files: documents.map((document) => document.fileName),
    },
    totalChunks: chunks.length,
    cityCounts: countBy(chunks, (chunk) => chunk.city, CITY_DEFINITIONS.map((city) => city.slug)),
    sectionCounts: countBy(chunks, (chunk) => chunk.section, KNOWLEDGE_SECTIONS),
    totalCharacters,
    minimumChunkCharacters: Math.min(...characterCounts),
    maximumChunkCharacters: Math.max(...characterCounts),
    averageChunkCharacters: Math.round(totalCharacters / chunks.length),
    referenceDocumentsDetected,
    referenceChunks: referenceChunks.length,
    tableDerivedParagraphs: parsedResults.reduce(
      (sum, result) => sum + result.tableDerivedParagraphs,
      0,
    ),
    tableHeadingCandidatesIgnored: parsedResults.reduce(
      (sum, result) => sum + result.tableHeadingCandidatesIgnored,
      0,
    ),
    duplicateParagraphsRemoved: parsedResults.reduce((sum, result) => sum + result.duplicateCount, 0),
    parserWarnings: Object.fromEntries(
      documents.map((document, index) => [document.fileName, parsedResults[index].warnings]),
    ),
  };
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function buildKnowledgeCorpus({ source, output = defaultOutputDirectory } = {}) {
  const documents = discoverSourceDocuments(source ?? process.env.JIANGSU_KNOWLEDGE_SOURCE);
  const resolvedOutput = path.resolve(output);
  const parsedResults = [];
  const chunks = [];

  console.log(`Found documents: ${documents.length}`);
  console.log(`Recognized cities: ${documents.length} / ${CITY_DEFINITIONS.length}`);

  for (const document of documents) {
    const parsed = await parseDocxDocument(document);
    parsedResults.push(parsed);
    chunks.push(...chunkEntries(parsed.entries));
    console.log(`${document.nameZh}: ${parsed.entries.length} source paragraphs`);
  }

  validateKnowledgeChunks(chunks);
  const generatedAt = new Date().toISOString();
  const manifest = createManifest(chunks, generatedAt);
  const report = createReport(chunks, documents, parsedResults, generatedAt);

  await writeJson(path.join(resolvedOutput, "corpus.json"), chunks);
  await writeJson(path.join(resolvedOutput, "manifest.json"), manifest);
  for (const city of CITY_DEFINITIONS) {
    await writeJson(
      path.join(resolvedOutput, "cities", `${city.slug}.json`),
      chunks.filter((chunk) => chunk.city === city.slug),
    );
  }
  await writeJson(defaultReportPath, report);

  console.log(`Generated chunks: ${chunks.length}`);
  console.log(`Output: ${resolvedOutput}`);
  return { chunks, manifest, report, outputDirectory: resolvedOutput };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  await buildKnowledgeCorpus({ source: options.source, output: options.output });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
