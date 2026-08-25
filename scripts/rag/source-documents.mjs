import fs from "node:fs";
import path from "node:path";

import { CITY_DEFINITIONS } from "./config.mjs";

function ingestionError(code, details = []) {
  const error = new Error([code, ...details].join("\n"));
  error.code = code;
  return error;
}

export function recognizeCityFromFilename(fileName) {
  const matches = CITY_DEFINITIONS.filter((city) => fileName.includes(city.nameZh));
  return matches.length === 1 ? matches[0] : null;
}

export function discoverSourceDocuments(sourceDirectory) {
  if (!sourceDirectory) {
    throw ingestionError("SOURCE_DIRECTORY_REQUIRED", [
      'Example: npm run rag:build -- --source "<DOCX_DIRECTORY>"',
    ]);
  }

  const resolvedSource = path.resolve(sourceDirectory);
  if (!fs.existsSync(resolvedSource) || !fs.statSync(resolvedSource).isDirectory()) {
    throw ingestionError("SOURCE_DIRECTORY_INVALID", [resolvedSource]);
  }

  const docxFiles = fs
    .readdirSync(resolvedSource, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.docx$/iu.test(entry.name) && !entry.name.startsWith("~$"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "zh-CN"));

  const byCity = new Map();
  const unrecognized = [];
  for (const fileName of docxFiles) {
    const city = recognizeCityFromFilename(fileName);
    if (!city) {
      unrecognized.push(fileName);
      continue;
    }
    const current = byCity.get(city.slug) ?? [];
    current.push(fileName);
    byCity.set(city.slug, current);
  }

  const ambiguous = [...byCity.entries()].filter(([, files]) => files.length > 1);
  if (ambiguous.length) {
    throw ingestionError(
      "AMBIGUOUS_CITY_DOCUMENTS",
      ambiguous.map(([slug, files]) => `${slug}: ${files.join(", ")}`),
    );
  }

  const missing = CITY_DEFINITIONS.filter((city) => !byCity.has(city.slug));
  if (missing.length || unrecognized.length || docxFiles.length !== CITY_DEFINITIONS.length) {
    throw ingestionError("MISSING_CITY_DOCUMENTS", [
      `Found documents: ${docxFiles.length}`,
      `Missing: ${missing.map((city) => city.nameZh).join(", ") || "None"}`,
      `Unrecognized: ${unrecognized.join(", ") || "None"}`,
    ]);
  }

  return CITY_DEFINITIONS.map((city) => {
    const fileName = byCity.get(city.slug)[0];
    return {
      ...city,
      fileName,
      filePath: path.join(resolvedSource, fileName),
    };
  });
}
